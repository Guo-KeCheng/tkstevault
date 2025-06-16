import Link from "next/link";
import { Instagram, Youtube, Mail, ChefHat } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Recipes Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recipes</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Italian
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Desserts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Healthy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Appetizers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Main Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Side Dishes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Beverages
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-orange-600"
                >
                  My Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Cooking Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Kitchen Tools
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-orange-600"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600">
                  Submit Recipe
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-orange-600"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-4 md:mb-0">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <span>
              © {currentYear} My Recipe Blog. Made with love in my kitchen.
            </span>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-orange-500">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500">
              <span className="sr-only">YouTube</span>
              <Youtube className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500">
              <span className="sr-only">Email</span>
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
