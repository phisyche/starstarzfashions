
import { useState } from "react";
import { Link } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { products } from "@/data/products";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  
  const filteredProducts = query 
    ? products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.slug.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="hidden md:flex items-center justify-between text-gray-600 hover:text-primary hover:bg-transparent"
          aria-label="Search products"
        >
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <Command className="rounded-lg">
          <CommandInput 
            placeholder="Search for products..." 
            value={query}
            onValueChange={setQuery} 
            autoFocus
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Products">
              {filteredProducts.slice(0, 10).map((product) => (
                <CommandItem 
                  key={product.id} 
                  value={product.slug}
                  onSelect={() => {
                    setOpen(false);
                  }}
                  className="flex items-center"
                >
                  <Link 
                    to={`/product/${product.slug}`}
                    className="flex items-center w-full"
                    onClick={() => setOpen(false)}
                  >
                    <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 mr-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} • KES {product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
