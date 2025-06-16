"use client";

import { Clock, ChefHat } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageSrc, setImageSrc] = useState(
    recipe.image_url ||
      "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=80",
  );

  return (
    <Link href={`/recipes/${recipe.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer group-hover:scale-[1.02]">
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={imageSrc}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:brightness-110 transition-all duration-300"
            onError={() =>
              setImageSrc(
                "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=80",
              )
            }
          />
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
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
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-600 font-medium">
              {recipe.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex items-center text-gray-500 text-sm">
            <ChefHat className="h-4 w-4 mr-1" />
            Serves {recipe.servings}
          </div>
        </div>
      </div>
    </Link>
  );
}
