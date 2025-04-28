
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { useSupabase } from "@/context/SupabaseContext";
import { Search } from "lucide-react";
import { products as localProducts, categories as localCategories } from "@/data/products"; // Import local data for fallback
import { debounce } from "@/lib/utils";

// Define types for search results and indexes
type SearchResult = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  type: "product" | "category" | "collection";
  keywords?: string[];
  score?: number;
};

// Define search index type for faster lookups
type SearchIndex = {
  [key: string]: {
    products: Map<string, SearchResult>;
    categories: Map<string, SearchResult>;
    collections: Map<string, SearchResult>;
  }
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Create a search index for faster lookups (memoized)
  const [searchIndex, setSearchIndex] = useState<SearchIndex>({});
  const [isIndexBuilt, setIsIndexBuilt] = useState(false);

  // Build search index on component mount
  useEffect(() => {
    const buildSearchIndex = async () => {
      try {
        setIsLoading(true);
        const index: SearchIndex = {};
        
        // Try to get data from Supabase
        try {
          // Fetch products
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('id, name, slug, category, description, image, metadata');
            
          // Fetch categories
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('id, name, slug, description, image');
            
          // Fetch collections
          const { data: collectionsData, error: collectionsError } = await supabase
            .from('collections')
            .select('id, name, slug, description, image');
            
          // Process products for indexing
          if (productsData && !productsError) {
            productsData.forEach(product => {
              // Extract keywords from product name, category, and description
              const productKeywords = [
                product.name.toLowerCase(),
                product.category.toLowerCase(),
                product.description ? product.description.toLowerCase() : '',
                ...(product.metadata?.tags || []).map((tag: string) => tag.toLowerCase())
              ].filter(Boolean);
              
              // Index each keyword
              productKeywords.forEach(keyword => {
                if (!index[keyword]) {
                  index[keyword] = {
                    products: new Map(),
                    categories: new Map(),
                    collections: new Map()
                  };
                }
                
                index[keyword].products.set(product.id, {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  category: product.category,
                  image: product.image,
                  type: 'product',
                  keywords: productKeywords
                });
              });
            });
          }
          
          // Process categories for indexing
          if (categoriesData && !categoriesError) {
            categoriesData.forEach(category => {
              // Extract keywords
              const categoryKeywords = [
                category.name.toLowerCase(),
                category.description ? category.description.toLowerCase() : ''
              ].filter(Boolean);
              
              // Index each keyword
              categoryKeywords.forEach(keyword => {
                if (!index[keyword]) {
                  index[keyword] = {
                    products: new Map(),
                    categories: new Map(),
                    collections: new Map()
                  };
                }
                
                index[keyword].categories.set(category.id, {
                  id: category.id,
                  name: category.name,
                  slug: category.slug,
                  category: 'Category',
                  image: category.image,
                  type: 'category',
                  keywords: categoryKeywords
                });
              });
            });
          }
          
          // Process collections for indexing
          if (collectionsData && !collectionsError) {
            collectionsData.forEach(collection => {
              // Extract keywords
              const collectionKeywords = [
                collection.name.toLowerCase(),
                collection.description ? collection.description.toLowerCase() : ''
              ].filter(Boolean);
              
              // Index each keyword
              collectionKeywords.forEach(keyword => {
                if (!index[keyword]) {
                  index[keyword] = {
                    products: new Map(),
                    categories: new Map(),
                    collections: new Map()
                  };
                }
                
                index[keyword].collections.set(collection.id, {
                  id: collection.id,
                  name: collection.name,
                  slug: collection.slug,
                  category: 'Collection',
                  image: collection.image,
                  type: 'collection',
                  keywords: collectionKeywords
                });
              });
            });
          }
          
          setSearchIndex(index);
          setIsIndexBuilt(true);
          
        } catch (error) {
          console.error('Error building search index from Supabase:', error);
          
          // Fallback to local data
          console.log('Falling back to local data for search index');
          
          // Process local products
          localProducts.forEach(product => {
            const productKeywords = [
              product.name.toLowerCase(),
              product.category.toLowerCase(),
              product.description ? product.description.toLowerCase() : ''
            ].filter(Boolean);
            
            productKeywords.forEach(keyword => {
              if (!index[keyword]) {
                index[keyword] = {
                  products: new Map(),
                  categories: new Map(),
                  collections: new Map()
                };
              }
              
              index[keyword].products.set(product.id, {
                id: product.id,
                name: product.name,
                slug: product.slug,
                category: product.category,
                image: product.image,
                type: 'product',
                keywords: productKeywords
              });
            });
          });
          
          // Process local categories
          localCategories.forEach(category => {
            const categoryKeywords = [
              category.name.toLowerCase(),
              category.description ? category.description.toLowerCase() : ''
            ].filter(Boolean);
            
            categoryKeywords.forEach(keyword => {
              if (!index[keyword]) {
                index[keyword] = {
                  products: new Map(),
                  categories: new Map(),
                  collections: new Map()
                };
              }
              
              index[keyword].categories.set(category.id, {
                id: category.id,
                name: category.name,
                slug: category.slug,
                category: 'Category',
                image: category.image,
                type: 'category',
                keywords: categoryKeywords
              });
            });
          });
          
          setSearchIndex(index);
          setIsIndexBuilt(true);
        }
      } catch (error) {
        console.error('Error building search index:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    buildSearchIndex();
  }, [supabase]);

  // Toggle the search dialog with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Optimized search function using the search index
  const performSearch = (searchQuery: string) => {
    if (searchQuery.trim().length < 2 || !isIndexBuilt) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Split query into individual terms for more precise search
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      
      // Map to store all potential matches with their scores
      const matchesMap = new Map<string, SearchResult>();
      
      // For each search term, find matches in the index
      searchTerms.forEach(term => {
        // Get exact matches first
        if (searchIndex[term]) {
          // Add products from exact matches
          searchIndex[term].products.forEach((product) => {
            const existingMatch = matchesMap.get(`product-${product.id}`);
            if (existingMatch) {
              existingMatch.score = (existingMatch.score || 0) + 3; // Exact match bonus
            } else {
              matchesMap.set(`product-${product.id}`, { ...product, score: 3 });
            }
          });
          
          // Add categories from exact matches
          searchIndex[term].categories.forEach((category) => {
            const existingMatch = matchesMap.get(`category-${category.id}`);
            if (existingMatch) {
              existingMatch.score = (existingMatch.score || 0) + 3; // Exact match bonus
            } else {
              matchesMap.set(`category-${category.id}`, { ...category, score: 3 });
            }
          });
          
          // Add collections from exact matches
          searchIndex[term].collections.forEach((collection) => {
            const existingMatch = matchesMap.get(`collection-${collection.id}`);
            if (existingMatch) {
              existingMatch.score = (existingMatch.score || 0) + 3; // Exact match bonus
            } else {
              matchesMap.set(`collection-${collection.id}`, { ...collection, score: 3 });
            }
          });
        }
        
        // Look for partial matches
        Object.keys(searchIndex).forEach(keyword => {
          if (keyword.includes(term)) {
            // Add products from partial matches
            searchIndex[keyword].products.forEach((product) => {
              const matchKey = `product-${product.id}`;
              const existingMatch = matchesMap.get(matchKey);
              if (existingMatch) {
                existingMatch.score = (existingMatch.score || 0) + 1; // Partial match
              } else {
                matchesMap.set(matchKey, { ...product, score: 1 });
              }
            });
            
            // Add categories from partial matches
            searchIndex[keyword].categories.forEach((category) => {
              const matchKey = `category-${category.id}`;
              const existingMatch = matchesMap.get(matchKey);
              if (existingMatch) {
                existingMatch.score = (existingMatch.score || 0) + 1; // Partial match
              } else {
                matchesMap.set(matchKey, { ...category, score: 1 });
              }
            });
            
            // Add collections from partial matches
            searchIndex[keyword].collections.forEach((collection) => {
              const matchKey = `collection-${collection.id}`;
              const existingMatch = matchesMap.get(matchKey);
              if (existingMatch) {
                existingMatch.score = (existingMatch.score || 0) + 1; // Partial match
              } else {
                matchesMap.set(matchKey, { ...collection, score: 1 });
              }
            });
          }
        });
      });
      
      // Convert map to array and sort by score (higher scores first)
      const sortedResults = Array.from(matchesMap.values())
        .sort((a, b) => {
          // Sort by score first
          const scoreDiff = (b.score || 0) - (a.score || 0);
          if (scoreDiff !== 0) return scoreDiff;
          
          // If scores are equal, sort alphabetically by name
          return a.name.localeCompare(b.name);
        });
      
      // Limit results
      const limitedResults = sortedResults.slice(0, 10);
      setResults(limitedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => performSearch(value), 300),
    [searchIndex, isIndexBuilt]
  );

  // Handle search input change
  const handleSearch = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle selection of search result
  const handleSelect = (item: SearchResult) => {
    setOpen(false);
    
    switch (item.type) {
      case 'product':
        navigate(`/product/${item.slug}`);
        break;
      case 'category':
        navigate(`/shop/${item.slug}`);
        break;
      case 'collection':
        navigate(`/collections/${item.slug}`);
        break;
    }
  };

  return (
    <>
      <button
        className="inline-flex items-center gap-2 text-sm"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden pointer-events-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search products, categories..." 
          value={query}
          onValueChange={handleSearch}
          ref={inputRef}
          autoFocus
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? (
              <div className="py-6 text-center text-sm">Searching...</div>
            ) : (
              <div className="py-6 text-center text-sm">No results found.</div>
            )}
          </CommandEmpty>
          {results.length > 0 && (
            <>
              {results.some(item => item.type === 'product') && (
                <CommandGroup heading="Products">
                  {results
                    .filter(item => item.type === 'product')
                    .map(item => (
                      <CommandItem
                        key={`${item.type}-${item.id}`}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center gap-2"
                      >
                        {item.image && (
                          <div className="h-8 w-8 overflow-hidden rounded bg-muted">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
              
              {results.some(item => item.type === 'category') && (
                <CommandGroup heading="Categories">
                  {results
                    .filter(item => item.type === 'category')
                    .map(item => (
                      <CommandItem
                        key={`${item.type}-${item.id}`}
                        onSelect={() => handleSelect(item)}
                      >
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <div className="h-6 w-6 overflow-hidden rounded bg-muted">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span>{item.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
              
              {results.some(item => item.type === 'collection') && (
                <CommandGroup heading="Collections">
                  {results
                    .filter(item => item.type === 'collection')
                    .map(item => (
                      <CommandItem
                        key={`${item.type}-${item.id}`}
                        onSelect={() => handleSelect(item)}
                      >
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <div className="h-6 w-6 overflow-hidden rounded bg-muted">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span>{item.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          )}
          
          <CommandSeparator />
          <div className="py-2 px-2 text-xs text-muted-foreground">
            <kbd className="rounded border bg-muted px-1.5 font-mono">↑↓</kbd> to navigate,{' '}
            <kbd className="rounded border bg-muted px-1.5 font-mono">enter</kbd> to select,{' '}
            <kbd className="rounded border bg-muted px-1.5 font-mono">esc</kbd> to close
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
}
