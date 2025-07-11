"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import RecipeEditor from "@/components/recipe-editor";
import {
  InfoIcon,
  UserCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "../../../supabase/client";

interface Recipe {
  id: string;
  title: string;
  description: string;
  content: any;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  image_url: string;
  video_url: string;
  media_urls: string[];
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "create" | "edit"
  >("dashboard");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [adminMode, setAdminMode] = useState<"recipe" | "blog">("recipe");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");

      if (adminAuth === "true" && loginTime) {
        // Check if session is still valid (24 hours)
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

        if (now - loginTimestamp < sessionDuration) {
          setIsAuthenticated(true);
          const mode =
            (localStorage.getItem("adminMode") as "recipe" | "blog") ||
            "recipe";
          setAdminMode(mode);
          fetchRecipes();
        } else {
          // Session expired
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminLoginTime");
          router.push("/admin");
        }
      } else {
        router.push("/admin");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchRecipes = async () => {
    try {
      const supabase = createClient();
      const tableName = adminMode === "blog" ? "blog_posts" : "recipes";
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setRecipes(data);
      }
    } catch (error) {
      console.error(`Error fetching ${adminMode}s:`, error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    localStorage.removeItem("adminMode");
    router.push("/");
  };

  const toggleAdminMode = () => {
    const newMode = adminMode === "recipe" ? "blog" : "recipe";
    setAdminMode(newMode);
    localStorage.setItem("adminMode", newMode);
  };

  const handleCreateRecipe = () => {
    setCurrentView("create");
    setSelectedRecipe(null);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setCurrentView("edit");
    setSelectedRecipe(recipe);
  };

  const handleSaveRecipe = async (recipeData: any) => {
    // Refresh recipes from database after save
    await fetchRecipes();
    setCurrentView("dashboard");
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const itemType = adminMode === "blog" ? "blog post" : "recipe";
    if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        const supabase = createClient();
        const tableName = adminMode === "blog" ? "blog_posts" : "recipes";
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq("id", recipeId);

        if (error) throw error;

        // Refresh items after deletion
        await fetchRecipes();
      } catch (error) {
        console.error(`Error deleting ${itemType}:`, error);
        alert(`Failed to delete ${itemType}. Please try again.`);
      }
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedRecipe(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (currentView === "create" || currentView === "edit") {
    return (
      <RecipeEditor
        recipe={selectedRecipe || undefined}
        onSave={handleSaveRecipe}
        onCancel={handleBackToDashboard}
        mode={adminMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {adminMode === "recipe" ? "Recipe Dashboard" : "Blog Dashboard"}
              </h1>
              <p className="text-gray-600 mt-2">
                {adminMode === "recipe"
                  ? "Manage your recipe blog content"
                  : "Create and manage blog posts with rich content"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                <ChefHat
                  className={`w-4 h-4 ${
                    adminMode === "recipe" ? "text-orange-600" : "text-gray-400"
                  }`}
                />
                <button
                  onClick={toggleAdminMode}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    adminMode === "recipe"
                      ? "bg-orange-600 text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Recipe
                </button>
                <button
                  onClick={toggleAdminMode}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    adminMode === "blog"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Blog
                </button>
                <Edit
                  className={`w-4 h-4 ${
                    adminMode === "blog" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
              </div>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Recipes
                </CardTitle>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipes.length}</div>
                <p className="text-xs text-muted-foreground">Total recipes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {recipes.filter((r) => r.published).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Published recipes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {adminMode === "recipe" ? "Avg Prep Time" : "Total Views"}
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminMode === "recipe" && recipes.length > 0
                    ? Math.round(
                        recipes.reduce(
                          (acc, r) => acc + (r.prep_time || 0),
                          0,
                        ) / recipes.length,
                      ) + "m"
                    : adminMode === "blog"
                      ? "N/A"
                      : "0m"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {adminMode === "recipe" ? "Average time" : "Coming soon"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <UserCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {recipes.filter((r) => r.featured).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Featured recipes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your recipe blog content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="h-20 flex flex-col gap-2"
                  onClick={handleCreateRecipe}
                >
                  <Plus className="h-6 w-6" />
                  {adminMode === "recipe"
                    ? "Add New Recipe"
                    : "Create Blog Post"}
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() => router.push("/")}
                >
                  <Eye className="h-6 w-6" />
                  View Published
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={() =>
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    })
                  }
                >
                  <Edit className="h-6 w-6" />
                  Manage Recipes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {adminMode === "recipe" ? "Your Recipes" : "Your Blog Posts"}
              </CardTitle>
              <CardDescription>
                {adminMode === "recipe"
                  ? "Manage and edit your recipe collection"
                  : "Manage and edit your blog posts"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recipes.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {adminMode === "recipe"
                      ? "No recipes yet. Create your first recipe!"
                      : "No blog posts yet. Create your first post!"}
                  </p>
                  <Button onClick={handleCreateRecipe}>
                    <Plus className="w-4 h-4 mr-2" />
                    {adminMode === "recipe"
                      ? "Create Recipe"
                      : "Create Blog Post"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {recipe.title}
                            </h3>
                            <div className="flex gap-1">
                              {recipe.published && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Published
                                </span>
                              )}
                              {recipe.featured && (
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {recipe.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {adminMode === "recipe" && (
                              <>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {(recipe.prep_time || 0) +
                                    (recipe.cook_time || 0)}{" "}
                                  min
                                </span>
                                <span>{recipe.servings} servings</span>
                                <span className="capitalize">
                                  {recipe.difficulty}
                                </span>
                              </>
                            )}
                            <span>{recipe.category}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(recipe.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRecipe(recipe)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Info */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Information</CardTitle>
              <CardDescription>Current session details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <UserCircle size={48} className="text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Administrator</h3>
                    <p className="text-sm text-gray-600">Recipe Blog Admin</p>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex gap-2 items-center text-orange-800">
                    <InfoIcon size={16} />
                    <span className="text-sm font-medium">
                      Admin Dashboard Access
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    You have full access to manage recipes, categories, and blog
                    content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
