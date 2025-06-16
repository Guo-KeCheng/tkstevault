import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <MessageCircle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Have a question about a recipe? Want to share your cooking
                success? I'd love to hear from you!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        Send me a message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              First Name
                            </label>
                            <Input placeholder="Your first name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Last Name
                            </label>
                            <Input placeholder="Your last name" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Email
                          </label>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Subject
                          </label>
                          <Input placeholder="What's this about?" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Message
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            rows={6}
                            placeholder="Tell me about your cooking adventures, ask questions, or share feedback..."
                          ></textarea>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                      Let's Connect
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      I love connecting with fellow food enthusiasts! Whether
                      you have questions about a recipe, want to share your
                      cooking successes, or just want to chat about food, don't
                      hesitate to reach out.
                    </p>
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Email Me
                        </h3>
                        <p className="text-gray-600">hello@recipeblog.com</p>
                        <p className="text-sm text-gray-500 mt-1">
                          I typically respond within 24-48 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Response Time
                        </h3>
                        <p className="text-gray-600">
                          Monday - Friday: Within 24 hours
                        </p>
                        <p className="text-gray-600">
                          Weekends: Within 48 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Location
                        </h3>
                        <p className="text-gray-600">San Francisco, CA</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Cooking from my home kitchen
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Can you help me modify a recipe?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Absolutely! I love helping with recipe modifications
                          for dietary restrictions or ingredient substitutions.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Do you take recipe requests?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Yes! I'm always looking for new recipe ideas. Send me
                          your requests and I'll do my best to create something
                          special.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Can I share your recipes?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Please feel free to share links to my recipes! If
                          you're sharing the recipe itself, please credit the
                          source.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Stay Updated
              </h2>
              <p className="text-gray-600 mb-8">
                Get the latest recipes and cooking tips delivered to your inbox.
                No spam, just delicious content!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Join 1,000+ food lovers who never miss a recipe!
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
