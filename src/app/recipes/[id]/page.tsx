"use client";

import { Suspense, useState, useEffect } from "react";
import { Clock, Users, ChefHat, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Recipe {
  id: number;
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

function getMockRecipes(): Recipe[] {
  return [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      description:
        "A timeless Italian classic with fresh basil, mozzarella, and tomato sauce on a perfectly crispy crust.",
      image_url:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80",
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
        "Salt and pepper to taste",
      ],
      instructions: [
        "In a large bowl, combine flour, yeast, and salt.",
        "Add warm water and olive oil, mix until a dough forms.",
        "Knead the dough on a floured surface for 8-10 minutes until smooth.",
        "Place in an oiled bowl, cover, and let rise for 1 hour.",
        "Preheat oven to 475°F (245°C).",
        "Roll out dough on a floured surface to desired thickness.",
        "Transfer to a pizza stone or baking sheet.",
        "Spread pizza sauce evenly over the dough.",
        "Add mozzarella slices and season with salt and pepper.",
        "Bake for 12-15 minutes until crust is golden and cheese is bubbly.",
        "Remove from oven and top with fresh basil leaves.",
        "Let cool for 2-3 minutes before slicing and serving.",
      ],
      notes:
        "For best results, use a pizza stone preheated in the oven. The dough can be made ahead and refrigerated for up to 24 hours.",
    },
    {
      id: 2,
      title: "Creamy Mushroom Risotto",
      description:
        "Rich and creamy Arborio rice cooked with wild mushrooms and finished with Parmesan cheese.",
      image_url:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
      prep_time: 10,
      cook_time: 35,
      servings: 4,
      difficulty: "medium",
      category: "Italian",
      tags: ["risotto", "mushroom", "vegetarian"],
      ingredients: [
        "1 1/2 cups Arborio rice",
        "4-5 cups warm chicken or vegetable broth",
        "1 lb mixed mushrooms, sliced",
        "1 medium onion, finely chopped",
        "3 cloves garlic, minced",
        "1/2 cup dry white wine",
        "1/2 cup grated Parmesan cheese",
        "3 tbsp butter",
        "2 tbsp olive oil",
        "Salt and pepper to taste",
        "Fresh parsley for garnish",
      ],
      instructions: [
        "Heat olive oil in a large pan and sauté mushrooms until golden. Set aside.",
        "In the same pan, melt 1 tbsp butter and sauté onion until translucent.",
        "Add garlic and cook for 1 minute.",
        "Add Arborio rice and stir for 2 minutes until lightly toasted.",
        "Pour in white wine and stir until absorbed.",
        "Add warm broth one ladle at a time, stirring constantly.",
        "Continue adding broth and stirring for 18-20 minutes until rice is creamy.",
        "Stir in cooked mushrooms, remaining butter, and Parmesan cheese.",
        "Season with salt and pepper.",
        "Serve immediately garnished with fresh parsley.",
      ],
      notes:
        "The key to perfect risotto is constant stirring and adding warm broth gradually. Don't rush the process!",
    },
    {
      id: 3,
      title: "Chocolate Lava Cake",
      description:
        "Decadent individual chocolate cakes with a molten center, served warm with vanilla ice cream.",
      image_url:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
      prep_time: 15,
      cook_time: 10,
      servings: 2,
      difficulty: "easy",
      category: "Dessert",
      tags: ["chocolate", "dessert", "quick"],
      ingredients: [
        "4 oz dark chocolate, chopped",
        "4 tbsp unsalted butter",
        "2 large eggs",
        "2 tbsp granulated sugar",
        "Pinch of salt",
        "2 tbsp all-purpose flour",
        "Butter for ramekins",
        "Cocoa powder for dusting",
        "Vanilla ice cream for serving",
      ],
      instructions: [
        "Preheat oven to 425°F (220°C).",
        "Butter two 6-oz ramekins and dust with cocoa powder.",
        "Melt chocolate and butter in a double boiler until smooth.",
        "In a bowl, whisk eggs, sugar, and salt until thick.",
        "Stir in the melted chocolate mixture.",
        "Fold in flour until just combined.",
        "Divide batter between prepared ramekins.",
        "Bake for 10-12 minutes until edges are firm but center jiggles.",
        "Let cool for 1 minute, then run a knife around edges.",
        "Invert onto serving plates and serve immediately with ice cream.",
      ],
      notes:
        "These can be made ahead and refrigerated. Just add an extra minute to baking time if baking from cold.",
    },
    {
      id: 4,
      title: "Fresh Garden Salad",
      description:
        "Crisp mixed greens with seasonal vegetables, cherry tomatoes, and homemade vinaigrette.",
      image_url:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      prep_time: 15,
      cook_time: 0,
      servings: 2,
      difficulty: "easy",
      category: "Healthy",
      tags: ["salad", "healthy", "vegetarian"],
      ingredients: [
        "4 cups mixed greens (lettuce, spinach, arugula)",
        "1 cup cherry tomatoes, halved",
        "1 cucumber, sliced",
        "1/2 red onion, thinly sliced",
        "1/4 cup olive oil",
        "2 tbsp balsamic vinegar",
        "1 tsp Dijon mustard",
        "Salt and pepper to taste",
        "1/4 cup crumbled feta cheese (optional)",
      ],
      instructions: [
        "Wash and dry all greens thoroughly.",
        "In a large bowl, combine mixed greens, cherry tomatoes, cucumber, and red onion.",
        "In a small bowl, whisk together olive oil, balsamic vinegar, and Dijon mustard.",
        "Season dressing with salt and pepper.",
        "Drizzle dressing over salad and toss gently.",
        "Top with crumbled feta cheese if desired.",
        "Serve immediately.",
      ],
      notes:
        "For best results, chill the salad ingredients before assembling. The dressing can be made ahead and stored in the refrigerator.",
    },
    {
      id: 5,
      title: "Beef Bourguignon",
      description:
        "Traditional French braised beef in red wine with pearl onions, mushrooms, and herbs.",
      image_url:
        "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
      prep_time: 30,
      cook_time: 150,
      servings: 6,
      difficulty: "hard",
      category: "French",
      tags: ["beef", "french", "wine"],
      ingredients: [
        "3 lbs beef chuck, cut into 2-inch pieces",
        "6 slices bacon, chopped",
        "1 large onion, sliced",
        "2 carrots, sliced",
        "2 cloves garlic, minced",
        "3 tbsp tomato paste",
        "1 bottle red wine (Burgundy preferred)",
        "2 cups beef broth",
        "2 bay leaves",
        "Fresh thyme sprigs",
        "1 lb pearl onions",
        "1 lb mushrooms, quartered",
        "3 tbsp butter",
        "3 tbsp flour",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Preheat oven to 325°F (165°C).",
        "Cook bacon in a large Dutch oven until crispy. Remove and set aside.",
        "Season beef with salt and pepper, then brown in bacon fat.",
        "Remove beef and sauté onions and carrots until softened.",
        "Add garlic and tomato paste, cook for 1 minute.",
        "Return beef and bacon to pot, add wine, broth, bay leaves, and thyme.",
        "Bring to a simmer, cover, and braise in oven for 2 hours.",
        "Meanwhile, sauté pearl onions and mushrooms in butter until golden.",
        "Add vegetables to the pot and continue cooking for 30 minutes.",
        "Mix flour with a little wine to make a slurry, stir into stew to thicken.",
        "Adjust seasoning and serve hot.",
      ],
      notes:
        "This dish tastes even better the next day. Serve with crusty bread or mashed potatoes.",
    },
    {
      id: 6,
      title: "Lemon Herb Salmon",
      description:
        "Pan-seared salmon fillet with fresh herbs, lemon, and a light butter sauce.",
      image_url:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
      prep_time: 10,
      cook_time: 10,
      servings: 2,
      difficulty: "easy",
      category: "Seafood",
      tags: ["salmon", "seafood", "healthy"],
      ingredients: [
        "2 salmon fillets (6 oz each)",
        "2 tbsp olive oil",
        "2 tbsp butter",
        "2 cloves garlic, minced",
        "1 lemon (juiced and zested)",
        "2 tbsp fresh dill, chopped",
        "2 tbsp fresh parsley, chopped",
        "Salt and pepper to taste",
        "Lemon wedges for serving",
      ],
      instructions: [
        "Season salmon fillets with salt and pepper.",
        "Heat olive oil in a large skillet over medium-high heat.",
        "Cook salmon skin-side up for 4-5 minutes until golden.",
        "Flip and cook for another 3-4 minutes.",
        "Remove salmon and keep warm.",
        "Add butter and garlic to the same pan, cook for 30 seconds.",
        "Add lemon juice, zest, dill, and parsley.",
        "Return salmon to pan and spoon sauce over fillets.",
        "Serve immediately with lemon wedges.",
      ],
      notes:
        "Don't overcook the salmon - it should be slightly pink in the center. Serve with roasted vegetables or rice.",
    },
  ];
}

export default function RecipePage({ params }: RecipePageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recipeId = parseInt(params.id);
    const mockRecipes = getMockRecipes();
    const foundRecipe = mockRecipes.find((r) => r.id === recipeId);

    setRecipe(foundRecipe || null);
    setLoading(false);
  }, [params.id]);

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
