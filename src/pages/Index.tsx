
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatisticsGrid } from "@/components/ui/statistics";
import { ItemGrid } from "@/components/ui/ItemGrid";
import { useBarterContext } from "@/context/BarterContext";
import { 
  ArrowRight, 
  CheckCircle2, 
  Repeat2, 
  ShieldCheck, 
  Star, 
  Package, 
  Bike, 
  BookOpen, 
  Utensils, 
  Shirt, 
  HelpCircle
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const Index = () => {
  const { items, users } = useBarterContext();
  
  // Get the most recent items
  const recentItems = [...items]
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .filter(item => item.isAvailable)
    .slice(0, 4);

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

  // Testimonials
  const testimonials = [
    {
      text: "I traded my old laptop for a mountain bike that I've been wanting for months. This platform saved me hundreds of dollars!",
      author: "Michael K.",
      location: "Portland, OR",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      text: "As a minimalist, I love being able to exchange items without accumulating more stuff. The community here is so supportive and honest.",
      author: "Sarah T.",
      location: "Austin, TX",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      text: "Found a vintage camera in exchange for some books I no longer needed. The transaction was smooth and the other trader was great to work with.",
      author: "David L.",
      location: "Chicago, IL",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "How does bartering work on this platform?",
      answer: "Users list items they're willing to trade and browse items others have posted. When you find something you want, you make an offer with your own items. If accepted, you arrange to meet and exchange items."
    },
    {
      question: "Is there any cost to use the platform?",
      answer: "No, our platform is completely free to use. We don't charge any fees for listing items or making trades."
    },
    {
      question: "How do I know I can trust other traders?",
      answer: "Our platform includes a reputation system where users rate each other after completed trades. You can view a user's rating before deciding to trade with them."
    },
    {
      question: "What if someone doesn't show up for a trade?",
      answer: "If a trader doesn't show up, you can report the incident through our platform. Users who repeatedly fail to complete trades may have their accounts restricted."
    },
    {
      question: "Can I trade services instead of physical items?",
      answer: "Yes! Many users trade services like tutoring, home repairs, or professional skills alongside physical items."
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
        
        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-barter-primary">Community Testimonials</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Hear what our members are saying about their barter experiences
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-none shadow-md relative">
                  <CardContent className="pt-10 pb-6">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full object-cover" />
                      </div>
                    </div>
                    <div className="flex justify-center mb-4">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <p className="text-gray-700 italic text-center mb-4">"{testimonial.text}"</p>
                    <div className="text-center">
                      <p className="font-semibold text-barter-primary">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Recent Items Section */}
        <section className="py-16 bg-gray-50">
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
        
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-barter-primary">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Find answers to common questions about our bartering platform
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="bg-white p-6 rounded-lg shadow-md">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-barter-primary hover:no-underline">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-barter-accent" />
                        {item.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2 pb-4 px-7">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
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
