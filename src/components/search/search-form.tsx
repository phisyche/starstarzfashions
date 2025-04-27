
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  buttonText?: boolean;
}

export function SearchForm({ 
  className = "", 
  defaultValue = "", 
  placeholder = "Search products...",
  buttonText = false
}: SearchFormProps) {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">
        <Search className="h-4 w-4" />
        {buttonText && <span className="ml-2">Search</span>}
      </Button>
    </form>
  );
}
