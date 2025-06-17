import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import RecipeCard from "@/components/recipe-card";
import RecipeFilters from "@/components/recipe-filters";
import { ChefHat } from "lucide-react";
import { createClient } from "../../supabase/server";
import { Suspense } from "react";
import Link from "next/link";

interface SearchParams {
  search?: string;
  category?: string;
  difficulty?: string;
  maxCookTime?: string;
}

interface HomeProps {
  searchParams: SearchParams;
}

async function getRecipes() {
  try {
    const supabase = await createClient();
    const { data: featuredRecipes, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    // console.log("Featured Recipes:", featuredRecipes);
    if (error) {
      console.error("Error fetching recipes:", error);
      return getMockRecipes();
    } else if (featuredRecipes && featuredRecipes.length > 0) {
      return featuredRecipes;
    } else {
      return getMockRecipes();
    }
  } catch (error) {
    console.error("Error:", error);
    return getMockRecipes();
  }
}

async function getBlogPosts() {
  try {
    const supabase = await createClient();
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
    return blogPosts || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
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
}

function filterRecipes(recipes: any[], searchParams: SearchParams) {
  let filtered = [...recipes];

  // Search filter
  if (searchParams.search) {
    filtered = filtered.filter(
      (recipe) =>
        recipe.title
          .toLowerCase()
          .includes(searchParams.search!.toLowerCase()) ||
        recipe.description
          .toLowerCase()
          .includes(searchParams.search!.toLowerCase()) ||
        recipe.category
          .toLowerCase()
          .includes(searchParams.search!.toLowerCase()) ||
        (recipe.tags &&
          recipe.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchParams.search!.toLowerCase()),
          )),
    );
  }

  // Category filter
  if (searchParams.category && searchParams.category !== "all") {
    filtered = filtered.filter((recipe) =>
      recipe.category
        .toLowerCase()
        .includes(searchParams.category!.toLowerCase()),
    );
  }

  // Difficulty filter
  if (searchParams.difficulty && searchParams.difficulty !== "all") {
    filtered = filtered.filter(
      (recipe) => recipe.difficulty === searchParams.difficulty,
    );
  }

  // Cook time filter
  if (searchParams.maxCookTime && searchParams.maxCookTime !== "all") {
    const maxTime = parseInt(searchParams.maxCookTime);
    filtered = filtered.filter((recipe) => {
      const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
      return totalTime <= maxTime;
    });
  }

  return filtered;
}

function getUniqueCategories(recipes: any[]) {
  const categories = recipes.map((r) => r.category);
  const unique: string[] = [];
  categories.forEach((cat) => {
    if (!unique.includes(cat)) unique.push(cat);
  });
  return unique;
}

async function RecipesList({ searchParams }: { searchParams: SearchParams }) {
  const recipes = await getRecipes();
  const filteredRecipes = filterRecipes(recipes, searchParams);
  const uniqueCategories = getUniqueCategories(recipes);

  return (
    <>
      <RecipeFilters
        uniqueCategories={uniqueCategories}
        totalRecipes={recipes.length}
        filteredCount={filteredRecipes.length}
      />

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
        </div>
      )}
    </>
  );
}

function BlogPostCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer group-hover:scale-[1.02]">
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={
              post.image_url ||
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80"
            }
            alt={post.title}
            className="w-full h-48 object-cover group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Blog
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              {post.category || "General"}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {post.tags?.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

async function BlogSection() {
  const blogPosts = await getBlogPosts();

  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Latest Blog Posts
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Discover stories, tips, and insights from my culinary journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {blogPosts.length >= 6 && (
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            View All Blog Posts
          </Link>
        </div>
      )}
    </section>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Search and Filter Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto" id="recipes">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Discover Amazing Recipes
          </h2>

          <Suspense
            fallback={
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="mt-2 text-gray-600">Loading recipes...</p>
              </div>
            }
          >
            <RecipesList searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      {/* Blog Posts Section */}
      <Suspense fallback={<div className="py-16"></div>}>
        <BlogSection />
      </Suspense>

      <Footer />
    </div>
  );
}
