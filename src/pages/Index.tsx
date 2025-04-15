
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  CheckCircle2, 
  Repeat2, 
  ShieldCheck, 
  Package, 
  Bike, 
  BookOpen, 
  Utensils, 
  Shirt
} from "lucide-react";
import { useBarterContext } from "@/context/BarterContext";

const Index = () => {
  const { items, users } = useBarterContext();
  
  // Featured categories
  const categories = [
    { 
      name: "Electronics", 
      icon: <Package className="h-8 w-8 text-barter-accent" />,
      description: "Gadgets, computers, phones, and more",
      itemCount: 42
    },
    { 
      name: "Sports", 
      icon: <Bike className="h-8 w-8 text-barter-accent" />,
      description: "Equipment, clothing, and accessories",
      itemCount: 35
    },
    { 
      name: "Books", 
      icon: <BookOpen className="h-8 w-8 text-barter-accent" />,
      description: "Fiction, non-fiction, and textbooks",
      itemCount: 59
    },
    { 
      name: "Kitchen", 
      icon: <Utensils className="h-8 w-8 text-barter-accent" />,
      description: "Appliances, utensils, and cookware",
      itemCount: 27
    },
    { 
      name: "Clothing", 
      icon: <Shirt className="h-8 w-8 text-barter-accent" />,
      description: "Apparel for all ages and seasons",
      itemCount: 83
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-barter-primary to-barter-secondary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Trade Goods Without Money in Your Community
                </h1>
                <p className="text-xl opacity-90">
                  A sustainable way to exchange items you no longer need for things you want.
                </p>
                <div className="space-x-4 pt-4">
                  <Button 
                    size="lg" 
                    asChild 
                    className="bg-barter-accent hover:bg-barter-accent/90 text-white shadow-lg transform transition-all hover:scale-105 active:scale-95"
                  >
                    <Link to="/marketplace">Browse Marketplace</Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="bg-white text-barter-primary hover:bg-barter-accent hover:text-white shadow-md transform transition-all hover:scale-105 active:scale-95 border-transparent"
                  >
                    <Link to="/register">Join Community</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1563014959-7aaa83350992?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80"
                  alt="Community trading"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-barter-primary">Popular Categories</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Discover the most active categories in our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-6 flex flex-col items-center text-center h-full">
                    <div className="mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700 mt-auto">
                      {category.itemCount} items available
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-barter-primary">How It Works</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Exchange items directly with other community members in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
                    <p className="text-gray-600">
                      Add photos and descriptions of items you're willing to trade. Be clear about condition and category.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Repeat2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Make Offers</h3>
                    <p className="text-gray-600">
                      Find items you want and make offers using your own items. Negotiate directly with other members.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Complete Trades</h3>
                    <p className="text-gray-600">
                      Meet up to exchange items, then rate each other to build community trust and reputation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
