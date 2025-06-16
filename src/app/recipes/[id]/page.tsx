"use client";

import { Suspense, useState, useEffect } from "react";
import { Clock, Users, ChefHat, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../supabase/client";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: string;
  tags?: string[];
  ingredients?: string[];
  instructions?: string[];
  notes?: string;
}

interface RecipePageProps {
  params: {
    id: string;
  };
}

function RecipeImage({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) {
  const [imageSrc, setImageSrc] = useState(
    src ||
      "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80",
  );

  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => {
          setImageSrc(
            "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80",
          );
        }}
      />
    </div>
  );
}

export default function RecipePage({ params }: RecipePageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const recipeId = params.id;
  //   const mockRecipes = getMockRecipes();
  //   const foundRecipe = mockRecipes.find((r) => r.id === recipeId);

  //   setRecipe(foundRecipe || null);
  //   setLoading(false);
  // }, [params.id]);
  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const getMockRecipes = () => [
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
    },
    {
      id: "4",
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
      id: "5",
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
      id: "6",
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


  const fetchRecipe = async () => {
    try {
      const supabase = createClient();
      const { data: recipes, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      let foundRecipe: Recipe | undefined;

      if (error || !recipes || recipes.length === 0) {
        console.error("Error fetching recipes:", error);
        foundRecipe = getMockRecipes().find((r) => r.id === params.id);
      } else {
        foundRecipe = recipes.find((r: any) => r.id === params.id);
      }

      setRecipe(foundRecipe || null);
    } catch (error) {
      console.error("Error:", error);
      const foundRecipe = getMockRecipes().find((r) => r.id === params.id);
      setRecipe(foundRecipe || null);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-2 text-gray-600">Loading recipe...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    notFound();
  }

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Link>

          {/* Recipe Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                    {recipe.category}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      recipe.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : recipe.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {recipe.difficulty}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {recipe.title}
                </h1>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {recipe.description}
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">
                      {totalTime} min
                    </div>
                    <div className="text-xs text-gray-500">Total Time</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">
                      {recipe.servings}
                    </div>
                    <div className="text-xs text-gray-500">Servings</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <ChefHat className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {recipe.difficulty}
                    </div>
                    <div className="text-xs text-gray-500">Difficulty</div>
                  </div>
                </div>
              </div>

              <div>
                <Suspense
                  fallback={
                    <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
                  }
                >
                  <RecipeImage
                    src={recipe.image_url}
                    alt={recipe.title}
                    title={recipe.title}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients?.map(
                    (ingredient: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ),
                  ) || (
                    <li className="text-gray-500 italic">
                      Ingredients not available
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions?.map(
                    (instruction: string, index: number) => (
                      <li key={index} className="flex">
                        <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed pt-1">
                          {instruction}
                        </p>
                      </li>
                    ),
                  ) || (
                    <li className="text-gray-500 italic">
                      Instructions not available
                    </li>
                  )}
                </ol>

                {recipe.notes && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                      Chef's Notes
                    </h3>
                    <p className="text-blue-800 text-sm">{recipe.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
