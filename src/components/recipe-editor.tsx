"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Upload, Image, Video, Save, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { createClient } from "../../supabase/client";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Recipe {
  id?: string;
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
}

interface RecipeEditorProps {
  recipe?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
  mode?: "recipe" | "blog";
}

export default function RecipeEditor({
  recipe,
  onSave,
  onCancel,
  mode = "recipe",
}: RecipeEditorProps) {
  const [formData, setFormData] = useState<Recipe>({
    title: "",
    description: "",
    content: null,
    ingredients: [""],
    instructions: [""],
    prep_time: 0,
    cook_time: 0,
    servings: 1,
    difficulty: "easy",
    category: "",
    tags: [],
    image_url: "",
    video_url: "",
    media_urls: [],
    published: false,
    featured: false,
    ...recipe,
  });

  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const handleInputChange = (field: keyof Recipe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: "ingredients" | "instructions",
    index: number,
    value: string,
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: "ingredients" | "instructions") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "ingredients" | "instructions",
    index: number,
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileUpload = async (file: File, type: "image" | "video") => {
    setIsUploading(true);
    try {
      // Create a mock URL for demo purposes
      // In a real app, you'd upload to Supabase Storage or another service
      const mockUrl = URL.createObjectURL(file);

      if (type === "image") {
        setFormData((prev) => ({
          ...prev,
          image_url: mockUrl,
          media_urls: [...prev.media_urls, mockUrl],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          video_url: mockUrl,
          media_urls: [...prev.media_urls, mockUrl],
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const supabase = createClient();
      const tableName = mode === "blog" ? "blog_posts" : "recipes";

      if (recipe?.id) {
        // Update existing item
        const updateData: any = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          tags: formData.tags,
          image_url: formData.image_url,
          video_url: formData.video_url,
          media_urls: formData.media_urls,
          published: formData.published,
          featured: formData.featured,
          updated_at: new Date().toISOString(),
        };

        // Add recipe-specific fields only for recipe mode
        if (mode === "recipe") {
          updateData.ingredients = formData.ingredients.filter((i) => i.trim());
          updateData.instructions = formData.instructions.filter((i) =>
            i.trim(),
          );
          updateData.prep_time = formData.prep_time;
          updateData.cook_time = formData.cook_time;
          updateData.servings = formData.servings;
          updateData.difficulty = formData.difficulty;
        }

        const { error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq("id", recipe.id);

        if (error) throw error;
      } else {
        // Create new item
        const insertData: any = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          category: formData.category,
          tags: formData.tags,
          image_url: formData.image_url,
          video_url: formData.video_url,
          media_urls: formData.media_urls,
          published: formData.published,
          featured: formData.featured,
        };

        // Add recipe-specific fields only for recipe mode
        if (mode === "recipe") {
          insertData.ingredients = formData.ingredients.filter((i) => i.trim());
          insertData.instructions = formData.instructions.filter((i) =>
            i.trim(),
          );
          insertData.prep_time = formData.prep_time;
          insertData.cook_time = formData.cook_time;
          insertData.servings = formData.servings;
          insertData.difficulty = formData.difficulty;
        }

        const { error } = await supabase.from(tableName).insert(insertData);

        if (error) throw error;
      }

      onSave(formData);
    } catch (error) {
      console.error(`Error saving ${mode}:`, error);
      alert(`Failed to save ${mode}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">
            {mode === "blog"
              ? recipe
                ? "Edit Blog Post"
                : "Create New Blog Post"
              : recipe
                ? "Edit Recipe"
                : "Create New Recipe"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === "blog" ? "Post Information" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={
                    mode === "blog" ? "Blog post title" : "Recipe title"
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder={
                    mode === "blog"
                      ? "Brief description of your post"
                      : "Brief description"
                  }
                />
              </div>

              {mode === "recipe" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Prep Time (min)
                    </label>
                    <Input
                      type="number"
                      value={formData.prep_time}
                      onChange={(e) =>
                        handleInputChange(
                          "prep_time",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cook Time (min)
                    </label>
                    <Input
                      type="number"
                      value={formData.cook_time}
                      onChange={(e) =>
                        handleInputChange(
                          "cook_time",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Servings
                    </label>
                    <Input
                      type="number"
                      value={formData.servings}
                      onChange={(e) =>
                        handleInputChange(
                          "servings",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        handleInputChange("difficulty", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    placeholder={
                      mode === "blog"
                        ? "e.g., Travel, Food, Lifestyle"
                        : "e.g., Italian, Dessert, Healthy"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleTagAdd())
                      }
                    />
                    <Button type="button" onClick={handleTagAdd}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Featured Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {formData.image_url ? (
                      <div className="relative">
                        <img
                          src={formData.image_url}
                          alt="Recipe"
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "image");
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {formData.video_url ? (
                      <div className="relative">
                        <video
                          src={formData.video_url}
                          className="w-full h-32 object-cover rounded"
                          controls
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => videoInputRef.current?.click()}
                        >
                          Change Video
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {isUploading ? "Uploading..." : "Upload Video"}
                        </Button>
                      </div>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "video");
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients - Only show for recipe mode */}
          {mode === "recipe" && (
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) =>
                          handleArrayChange(
                            "ingredients",
                            index,
                            e.target.value,
                          )
                        }
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem("ingredients", index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("ingredients")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ingredient
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions - Only show for recipe mode */}
          {mode === "recipe" && (
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          Step {index + 1}
                        </div>
                        <Input
                          value={instruction}
                          onChange={(e) =>
                            handleArrayChange(
                              "instructions",
                              index,
                              e.target.value,
                            )
                          }
                          placeholder={`Step ${index + 1} instructions`}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem("instructions", index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("instructions")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rich Text Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === "blog" ? "Blog Content" : "Recipe Story & Notes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px]">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => handleInputChange("content", content)}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["blockquote", "code-block"],
                      ["link", "image", "video"],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      ["clean"],
                    ],
                  }}
                  placeholder={
                    mode === "blog"
                      ? "Write your blog post content here. You can add images, videos, and rich formatting..."
                      : "Share the story behind this recipe, cooking tips, or any additional notes..."
                  }
                  style={{ height: mode === "blog" ? "350px" : "250px" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      handleInputChange("published", e.target.checked)
                    }
                    className="rounded"
                  />
                  <span>Publish immediately</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      handleInputChange("featured", e.target.checked)
                    }
                    className="rounded"
                  />
                  <span>Feature on homepage</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {mode === "blog"
                ? recipe
                  ? "Update Post"
                  : "Save Post"
                : recipe
                  ? "Update Recipe"
                  : "Save Recipe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
