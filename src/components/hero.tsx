import Link from "next/link";
import { ChefHat, BookOpen, Heart } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background with food pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <ChefHat className="w-20 h-20 text-orange-500 mx-auto mb-6" />
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Delicious{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Recipes
              </span>{" "}
              from My Kitchen
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Welcome to my culinary journey! Discover tested recipes, cooking
              tips, and the stories behind each dish. Every recipe is crafted
              with love and perfected through experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#recipes"
                className="inline-flex items-center px-8 py-4 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors text-lg font-medium"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Browse Recipes
              </Link>

              <Link
                href="#about"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                About My Kitchen
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Made with love</span>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                <span>Kitchen tested</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Detailed instructions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
