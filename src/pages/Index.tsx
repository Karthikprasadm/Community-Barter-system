import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatisticsGrid } from "@/components/ui/statistics";
import { ItemGrid } from "@/components/ui/ItemGrid";
import { useBarterContext } from "@/context/BarterContext";
import { ArrowRight, CheckCircle2, Repeat2, ShieldCheck } from "lucide-react";

const Index = () => {
  const { items, users } = useBarterContext();
  
  // Get the most recent items
  const recentItems = [...items]
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .filter(item => item.isAvailable)
    .slice(0, 4);

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
                    className="bg-white text-barter-primary hover:bg-white/90 shadow-md transform transition-all hover:scale-105 active:scale-95 border-transparent"
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
        
        {/* Recent Items Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-barter-primary">Recently Added Items</h2>
              <Button variant="ghost" asChild className="gap-1">
                <Link to="/marketplace">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <ItemGrid items={recentItems} users={users} />
          </div>
        </section>
        
        {/* Community Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-barter-primary">Community Stats</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                See how our barter community is growing and thriving
              </p>
            </div>
            
            <StatisticsGrid />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-barter-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Barter Community?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Start trading items with people in your area today and discover the benefits of a money-free exchange system.
            </p>
            <Button 
              size="lg" 
              asChild 
              className="bg-barter-accent hover:bg-barter-accent/90 text-white shadow-lg transform transition-all hover:scale-105 active:scale-95"
            >
              <Link to="/register">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
