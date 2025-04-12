
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
import { useState } from "react";

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    condition: string;
  }) => void;
}

export const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, category, condition });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ search, category: value, condition });
  };

  const handleConditionChange = (value: string) => {
    setCondition(value);
    onFilterChange({ search, category, condition: value });
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
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={condition} onValueChange={handleConditionChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Condition</SelectItem>
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
