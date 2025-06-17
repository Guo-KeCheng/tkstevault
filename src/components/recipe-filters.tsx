"use client";

import { useState } from "react";
import { Search, Filter, ChefHat } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface RecipeFiltersProps {
  uniqueCategories: string[];
  totalRecipes: number;
  filteredCount: number;
}

export default function RecipeFilters({
  uniqueCategories,
  totalRecipes,
  filteredCount,
}: RecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        {/* Category Filter */}
        <select
          value={searchParams.get("category") || "all"}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={searchParams.get("difficulty") || "all"}
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Cook Time Filter */}
        <select
          value={searchParams.get("maxCookTime") || "all"}
          onChange={(e) => handleFilterChange("maxCookTime", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">Any Time</option>
          <option value="30">Under 30 min</option>
          <option value="60">Under 1 hour</option>
          <option value="120">Under 2 hours</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          Showing {filteredCount} of {totalRecipes} recipes
        </p>
      </div>
    </>
  );
}
