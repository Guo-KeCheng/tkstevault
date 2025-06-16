"use client";

import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import RecipeCard from "@/components/recipe-card";
import { Search, Filter, ChefHat } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [maxCookTime, setMaxCookTime] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, maxCookTime]);

  const fetchRecipes = async () => {
    try {
      const supabase = createClient();
      const { data: featuredRecipes, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching recipes:", error);
        setRecipes(getMockRecipes());
      } else if (featuredRecipes && featuredRecipes.length > 0) {
        setRecipes(featuredRecipes);
      } else {
        setRecipes(getMockRecipes());
      }
    } catch (error) {
      console.error("Error:", error);
      setRecipes(getMockRecipes());
    } finally {
      setLoading(false);
    }
  };

  const getMockRecipes = () => [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      description:
        "A timeless Italian classic with fresh basil, mozzarella, and tomato sauce on a perfectly crispy crust.",
      image_url:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&q=80",
      prep_time: 15,
      cook_time: 15,
      servings: 4,
      difficulty: "medium",
      category: "Italian",
      tags: ["pizza", "italian", "vegetarian"],
    },
    {
      id: 2,
      title: "Creamy Mushroom Risotto",
      description:
        "Rich and creamy Arborio rice cooked with wild mushrooms and finished with Parmesan cheese.",
      image_url:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
      prep_time: 10,
      cook_time: 35,
      servings: 4,
      difficulty: "medium",
      category: "Italian",
      tags: ["risotto", "mushroom", "vegetarian"],
    },
    {
      id: 3,
      title: "Chocolate Lava Cake",
      description:
        "Decadent individual chocolate cakes with a molten center, served warm with vanilla ice cream.",
      image_url:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
      prep_time: 15,
      cook_time: 10,
      servings: 2,
      difficulty: "easy",
      category: "Dessert",
      tags: ["chocolate", "dessert", "quick"],
    },
    {
      id: 4,
      title: "Fresh Garden Salad",
      description:
        "Crisp mixed greens with seasonal vegetables, cherry tomatoes, and homemade vinaigrette.",
      image_url:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      prep_time: 15,
      cook_time: 0,
      servings: 2,
      difficulty: "easy",
      category: "Healthy",
      tags: ["salad", "healthy", "vegetarian"],
    },
    {
      id: 5,
      title: "Beef Bourguignon",
      description:
        "Traditional French braised beef in red wine with pearl onions, mushrooms, and herbs.",
      image_url:
        "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
      prep_time: 30,
      cook_time: 150,
      servings: 6,
      difficulty: "hard",
      category: "French",
      tags: ["beef", "french", "wine"],
    },
    {
      id: 6,
      title: "Lemon Herb Salmon",
      description:
        "Pan-seared salmon fillet with fresh herbs, lemon, and a light butter sauce.",
      image_url:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
      prep_time: 10,
      cook_time: 10,
      servings: 2,
      difficulty: "easy",
      category: "Seafood",
      tags: ["salmon", "seafood", "healthy"],
    },
  ];

  const filterRecipes = () => {
    let filtered = [...recipes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (recipe.tags &&
            recipe.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            )),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((recipe) =>
        recipe.category.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === selectedDifficulty,
      );
    }

    // Cook time filter
    if (maxCookTime !== "all") {
      const maxTime = parseInt(maxCookTime);
      filtered = filtered.filter((recipe) => {
        const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
        return totalTime <= maxTime;
      });
    }

    setFilteredRecipes(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterRecipes();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setMaxCookTime("all");
  };

  const getUniqueCategories = () => {
    const categories = recipes.map((recipe) => recipe.category);
    return [...new Set(categories)];
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Search and Filter Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Discover Amazing Recipes
          </h2>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            {/* Cook Time Filter */}
            <Select value={maxCookTime} onValueChange={setMaxCookTime}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Cook Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="30">Under 30 min</SelectItem>
                <SelectItem value="60">Under 1 hour</SelectItem>
                <SelectItem value="120">Under 2 hours</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-2 text-gray-600">Loading recipes...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Showing {filteredRecipes.length} of {recipes.length} recipes
              </p>
            </div>

            {/* Recipe Grid */}
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
