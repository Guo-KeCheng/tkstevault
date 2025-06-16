import { Suspense } from "react";
import { createClient } from "../../../supabase/server";
import { Clock, Search, Filter, ChefHat, Users, Timer } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchParams {
  search?: string;
  category?: string;
  difficulty?: string;
  maxCookTime?: string;
}

interface RecipesPageProps {
  searchParams: SearchParams;
}

function RecipeCard({ recipe }: { recipe: any }) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="aspect-video overflow-hidden">
          <img
            src={
              recipe.image_url ||
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&q=80"
            }
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
              {recipe.category || "Uncategorized"}
            </span>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              {totalTime > 0 ? `${totalTime} min` : "Quick"}
            </div>
            {recipe.difficulty && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
                {recipe.difficulty}
              </span>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Users className="w-4 h-4" />
                {recipe.servings}
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {recipe.description ||
              "A delicious recipe waiting to be discovered."}
          </p>
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {recipe.tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function RecipeFilters({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5" />
        Filter Recipes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select defaultValue={searchParams.category || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="seafood">Seafood</SelectItem>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <Select defaultValue={searchParams.difficulty || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Max Cook Time
          </label>
          <Select defaultValue={searchParams.maxCookTime || "all"}>
            <SelectTrigger>
              <SelectValue placeholder="Any Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Time</SelectItem>
              <SelectItem value="15">Under 15 min</SelectItem>
              <SelectItem value="30">Under 30 min</SelectItem>
              <SelectItem value="60">Under 1 hour</SelectItem>
              <SelectItem value="120">Under 2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

async function RecipesList({ searchParams }: { searchParams: SearchParams }) {
  let recipes = null;
  let error = null;

  try {
    const supabase = await createClient();

    let query = supabase
      .from("recipes")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    // Apply search filter
    if (searchParams.search) {
      query = query.or(
        `title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%,category.ilike.%${searchParams.search}%`,
      );
    }

    // Apply category filter
    if (searchParams.category && searchParams.category !== "all") {
      query = query.ilike("category", `%${searchParams.category}%`);
    }

    // Apply difficulty filter
    if (searchParams.difficulty && searchParams.difficulty !== "all") {
      query = query.eq("difficulty", searchParams.difficulty);
    }

    const result = await query;
    recipes = result.data;
    error = result.error;

    if (error) {
      console.error("Error fetching recipes:", error);
    }
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    error = err;
  }

  // Apply cook time filter (client-side since it involves calculation)
  let filteredRecipes = recipes || [];
  if (searchParams.maxCookTime && searchParams.maxCookTime !== "all") {
    const maxTime = parseInt(searchParams.maxCookTime);
    filteredRecipes = filteredRecipes.filter((recipe) => {
      const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
      return totalTime <= maxTime;
    });
  }

  // Fallback to mock data if no recipes
  const recipesToShow =
    filteredRecipes.length > 0
      ? filteredRecipes
      : [
          {
            id: "1",
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
            published: true,
          },
          {
            id: "2",
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
            published: true,
          },
          {
            id: "3",
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
            published: true,
          },
        ];

  return (
    <div>
      <div className="mb-6 text-gray-600">
        Found {recipesToShow.length} recipe
        {recipesToShow.length !== 1 ? "s" : ""}
        {searchParams.search && <span> for "{searchParams.search}"</span>}
      </div>

      {recipesToShow.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipesToShow.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecipesPage({ searchParams }: RecipesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              All Recipes
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of tested and perfected recipes.
              Use the search and filters below to find exactly what you're
              looking for.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search || ""}
                placeholder="Search recipes by name, ingredient, or category..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters */}
          <RecipeFilters searchParams={searchParams} />

          {/* Recipes List */}
          <Suspense
            fallback={
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <RecipesList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
