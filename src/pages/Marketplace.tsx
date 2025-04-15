
import { useState, useEffect } from "react";
import { useBarterContext } from "@/context/BarterContext";
import { Item } from "@/types";
import { FilterBar } from "@/components/ui/FilterBar";
import { ItemGrid } from "@/components/ui/ItemGrid";
import { Header } from "@/components/layout/Header";
import { useSearchParams } from "react-router-dom";

const Marketplace = () => {
  const { items, users } = useBarterContext();
  const [searchParams] = useSearchParams();
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: "",
    condition: "",
  });

  useEffect(() => {
    let results = items.filter(item => item.isAvailable);
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        item => 
          item.name.toLowerCase().includes(searchLower) || 
          item.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }
    
    if (filters.condition) {
      results = results.filter(item => item.condition === filters.condition);
    }
    
    setFilteredItems(results);
  }, [filters, items]);

  // Update search filter when URL parameters change
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setFilters(prevFilters => ({
        ...prevFilters,
        search: searchParam
      }));
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-barter-primary mb-2">Marketplace</h1>
          <p className="text-gray-600">
            Browse available items for bartering with the community
          </p>
        </div>
        
        <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
        
        {filteredItems.length > 0 ? (
          <ItemGrid items={filteredItems} users={users} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M6 8h.01"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">No Items Found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any items matching your current filters. Try adjusting your search or browsing all items.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
