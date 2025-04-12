
import { Button } from "@/components/ui/button";
import { categories, conditions } from "@/data/mockData";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    condition: string;
  }) => void;
  initialFilters?: {
    search: string;
    category: string;
    condition: string;
  };
}

export const FilterBar = ({ onFilterChange, initialFilters }: FilterBarProps) => {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [category, setCategory] = useState(initialFilters?.category || "");
  const [condition, setCondition] = useState(initialFilters?.condition || "");

  // Update local state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setSearch(initialFilters.search);
      setCategory(initialFilters.category);
      setCondition(initialFilters.condition);
    }
  }, [initialFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, category, condition });
  };

  const handleCategoryChange = (value: string) => {
    // If the special "_all" value is selected, convert it back to empty string
    const categoryValue = value === "_all" ? "" : value;
    setCategory(categoryValue);
    onFilterChange({ search, category: categoryValue, condition });
  };

  const handleConditionChange = (value: string) => {
    // If the special "_all" value is selected, convert it back to empty string
    const conditionValue = value === "_all" ? "" : value;
    setCondition(conditionValue);
    onFilterChange({ search, category, condition: conditionValue });
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setCondition("");
    onFilterChange({ search: "", category: "", condition: "" });
  };

  return (
    <div className="bg-white shadow-sm border rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search items..."
            className="pl-10 w-full"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal className="h-4 w-4 text-gray-500 hidden md:block" />
          <Select 
            value={category === "" ? "_all" : category} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={condition === "" ? "_all" : condition} 
            onValueChange={handleConditionChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Any Condition</SelectItem>
              {conditions.map((cond) => (
                <SelectItem key={cond} value={cond}>
                  {cond}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
