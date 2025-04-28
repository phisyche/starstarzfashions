
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { useSupabase } from "@/context/SupabaseContext";
import { Search } from "lucide-react";
import { products, categories } from "@/data/products"; // Import local data for fallback

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  type: "product" | "category" | "collection";
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Search function
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Try to search in Supabase first
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, slug, category, image')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);

      if (productsError || !productsData) {
        throw new Error('Supabase search failed, falling back to local data');
      }

      // Search categories from Supabase
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug, image')
        .ilike('name', `%${searchQuery}%`)
        .limit(3);

      if (categoriesError || !categoriesData) {
        throw new Error('Category search failed, falling back to local data');
      }

      // Search collections from Supabase
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('id, name, slug, image')
        .ilike('name', `%${searchQuery}%`)
        .limit(3);

      // Format results from Supabase
      const formattedResults: SearchResult[] = [
        ...(productsData?.map(p => ({ ...p, type: 'product' as const })) || []),
        ...(categoriesData?.map(c => ({ ...c, type: 'category' as const, category: 'Category' })) || []),
        ...(collectionsData?.map(c => ({ ...c, type: 'collection' as const, category: 'Collection' })) || [])
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error('Search error, falling back to local data:', error);
      
      // Fallback to local search if Supabase fails
      const searchTermLower = searchQuery.toLowerCase();
      
      const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchTermLower))
        .slice(0, 5)
        .map(p => ({ 
          id: p.id, 
          name: p.name, 
          slug: p.slug, 
          category: p.category,
          image: p.image,
          type: 'product' as const 
        }));
        
      const filteredCategories = categories
        .filter(c => c.name.toLowerCase().includes(searchTermLower))
        .slice(0, 3)
        .map(c => ({ 
          id: c.id, 
          name: c.name, 
          slug: c.slug,
          category: 'Category',
          image: c.image,
          type: 'category' as const 
        }));
        
      setResults([...filteredProducts, ...filteredCategories]);
    } finally {
      setIsLoading(false);
    }
  };

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
              
              {results.some(item => item.type === 'category' || item.type === 'collection') && (
                <CommandGroup heading="Categories & Collections">
                  {results
                    .filter(item => item.type === 'category' || item.type === 'collection')
                    .map(item => (
                      <CommandItem
                        key={`${item.type}-${item.id}`}
                        onSelect={() => handleSelect(item)}
                      >
                        <span>{item.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.type === 'category' ? 'Category' : 'Collection'}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          )}
          
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
