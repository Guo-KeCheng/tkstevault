import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ChefHat, Heart, Clock, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <ChefHat className="w-20 h-20 text-orange-500 mx-auto mb-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                About My Culinary Journey
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Welcome to my kitchen! I'm passionate about creating delicious,
                approachable recipes that bring people together around the
                dinner table.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
                    alt="Chef in kitchen"
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    My Story
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    My love for cooking began in my grandmother's kitchen, where
                    I learned that food is more than just sustenance—it's a way
                    to show love, create memories, and bring people together.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Over the years, I've traveled the world, collecting recipes
                    and techniques from different cultures. Each dish tells a
                    story, and I'm excited to share these culinary adventures
                    with you.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Whether you're a beginner cook or a seasoned chef, my goal
                    is to inspire you to get into the kitchen and create
                    something delicious.
                  </p>
                </div>
              </div>

              {/* Values Section */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Made with Love
                  </h3>
                  <p className="text-gray-600">
                    Every recipe is tested with care and attention to detail,
                    ensuring the best results for your kitchen.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Time-Tested
                  </h3>
                  <p className="text-gray-600">
                    All recipes are thoroughly tested and refined to ensure
                    consistent, delicious results every time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Family-Friendly
                  </h3>
                  <p className="text-gray-600">
                    Recipes designed to bring families together, with options
                    for all skill levels and dietary preferences.
                  </p>
                </div>
              </div>

              {/* Philosophy Section */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                  My Cooking Philosophy
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      Quality Ingredients
                    </h3>
                    <p className="text-gray-600 mb-6">
                      I believe in using the best ingredients you can find and
                      afford. Fresh, seasonal produce and quality pantry staples
                      make all the difference.
                    </p>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      Simple Techniques
                    </h3>
                    <p className="text-gray-600">
                      Great cooking doesn't have to be complicated. I focus on
                      fundamental techniques that anyone can master.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      Seasonal Cooking
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Cooking with the seasons ensures the best flavors and
                      supports local farmers and producers.
                    </p>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      Sharing & Community
                    </h3>
                    <p className="text-gray-600">
                      Food is meant to be shared. I love building a community of
                      home cooks who support and inspire each other.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-gray-900 text-center">
                By the Numbers
              </h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    150+
                  </div>
                  <div className="text-gray-600">Recipes Shared</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    10
                  </div>
                  <div className="text-gray-600">Years Cooking</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    25
                  </div>
                  <div className="text-gray-600">Countries Visited</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600">Kitchen Tested</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
