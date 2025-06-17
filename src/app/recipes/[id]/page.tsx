import { Suspense } from "react";
import { Clock, Users, ChefHat, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import Image from "next/image";

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

function RecipeImage({ src, alt }: { src: string; alt: string }) {
  const imageSrc =
    src ||
    "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80";

  return (
    <div className="aspect-video overflow-hidden rounded-lg relative">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

function getMockRecipes() {
  return [
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
      ingredients: [
        "2 cups all-purpose flour",
        "1 tsp active dry yeast",
        "1 tsp salt",
        "3/4 cup warm water",
        "2 tbsp olive oil",
        "1/2 cup pizza sauce",
        "8 oz fresh mozzarella, sliced",
        "Fresh basil leaves",
      ],
      instructions: [
        "Mix flour, yeast, and salt in a large bowl",
        "Add warm water and olive oil, mix until dough forms",
        "Knead dough for 8-10 minutes until smooth",
        "Let rise for 1 hour in oiled bowl",
        "Roll out dough and add toppings",
        "Bake at 475°F for 12-15 minutes",
      ],
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
      ingredients: [
        "1 1/2 cups Arborio rice",
        "4 cups warm chicken broth",
        "1 lb mixed mushrooms, sliced",
        "1 onion, diced",
        "3 cloves garlic, minced",
        "1/2 cup white wine",
        "1/2 cup grated Parmesan",
        "2 tbsp butter",
      ],
      instructions: [
        "Sauté mushrooms until golden, set aside",
        "Cook onion and garlic until soft",
        "Add rice, stir for 2 minutes",
        "Add wine, stir until absorbed",
        "Add broth one ladle at a time, stirring constantly",
        "Fold in mushrooms, butter, and Parmesan",
      ],
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
      ingredients: [
        "4 oz dark chocolate, chopped",
        "4 tbsp butter",
        "2 large eggs",
        "2 tbsp granulated sugar",
        "2 tbsp all-purpose flour",
        "Pinch of salt",
        "Butter for ramekins",
      ],
      instructions: [
        "Preheat oven to 425°F",
        "Melt chocolate and butter together",
        "Whisk eggs and sugar until thick",
        "Fold in chocolate mixture and flour",
        "Pour into buttered ramekins",
        "Bake for 10-12 minutes until edges are firm",
      ],
    },
  ];
}

async function getRecipe(id: string): Promise<Recipe | null> {
  try {
    const supabase = await createClient();
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("published", true)
      .eq("id", id)
      .single();

    if (error || !recipes) {
      console.error("Error fetching recipe:", error);
      const mockRecipes = getMockRecipes();
      return mockRecipes.find((r) => r.id === id) || null;
    }

    return recipes;
  } catch (error) {
    console.error("Error:", error);
    const mockRecipes = getMockRecipes();
    return mockRecipes.find((r) => r.id === id) || null;
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipe(params.id);

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
                <RecipeImage src={recipe.image_url} alt={recipe.title} />
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
