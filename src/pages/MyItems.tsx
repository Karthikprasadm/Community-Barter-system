import { useState } from "react";
import { useBarterContext } from "@/context/BarterContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ItemCard } from "@/components/ui/ItemCard";
import { Navigate, Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, conditions } from "@/data/mockData";
import { Item, ItemWithOwner } from "@/types";

const MyItems = () => {
  const { currentUser, getUserItems, addItem, isAdmin } = useBarterContext();
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    imageUrl: "",
    dropOption: "",
  });
  const [showDropOptions, setShowDropOptions] = useState(false);
  const [dropOption, setDropOption] = useState<'nah' | 'send'>("nah");

  // Block admins from adding items
  if (!currentUser || isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-semibold mb-2">You must be logged in as a regular user to add items.</h2>
        <p className="text-gray-600 mb-4">Please log in with a user account to manage your items. Admins cannot add trade items.</p>
        <a href="/login" className="px-4 py-2 bg-barter-primary text-white rounded hover:bg-barter-primary-dark transition">Go to Login</a>
      </div>
    );
  }

  const userItems: ItemWithOwner[] = getUserItems(currentUser.id).filter(item => item.isAvailable);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isAdmin) {
      alert("You must be logged in as a regular user to add items.");
      return;
    }
    addItem({
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      condition: newItem.condition as Item["condition"],
      isAvailable: true,
      imageUrl: newItem.imageUrl,
      dropOption: dropOption || "nah",
    });
    setNewItem({
      name: "",
      description: "",
      category: "",
      condition: "",
      imageUrl: "",
      dropOption: "",
    });
    setDropOption("nah");
    setOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-barter-primary mb-2">My Items</h1>
            <p className="text-gray-600">
              Manage your items available for trade
            </p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-barter-primary hover:bg-barter-secondary">
                <Plus className="mr-2 h-4 w-4" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>
                  List a new item to offer for bartering
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    placeholder="Vintage Camera"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    placeholder="A detailed description of your item"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={newItem.condition}
                      onValueChange={(value) => handleSelectChange("condition", value)}
                      required
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={newItem.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {/* Drop It Off button and options */}
                <div className="flex flex-col items-start mb-2">
                  <div className="relative">
                    <Button type="button" variant="outline" className="mt-2" onClick={() => setShowDropOptions((v) => !v)}>
                      Drop It Off
                    </Button>
                    {showDropOptions && (
                      <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <button type="button" className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => { setDropOption('nah'); setNewItem(prev => ({ ...prev, dropOption: 'nah' })); setShowDropOptions(false); }}>
                          Nah, I Got It
                        </button>
                        <button type="button" className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => { setDropOption('send'); setNewItem(prev => ({ ...prev, dropOption: 'send' })); setShowDropOptions(false); }}>
                          Send It Our Way
                        </button>
                      </div>
                    )}
                  </div>
                  {dropOption === 'nah' && (
                    <span className="mt-1 text-sm text-gray-600">Selected: Nah, I Got It</span>
                  )}
                  {dropOption === 'send' && (
                    <div className="mt-2 p-3 border rounded bg-gray-50 w-full max-w-xs">
                      <div className="font-semibold text-base">Barter-Nexus Warehouse</div>
                      <div className="text-xs text-gray-700 mt-1 whitespace-pre-line">
                        RNS Institute of Technology,{"\n"}
                        Dr. Vishnuvardhan Road{"\n"}
                        R R Nagar Post{"\n"}
                        Channasandra{"\n"}
                        Bengaluru -560 098
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-barter-primary hover:bg-barter-secondary">
                    Add Item
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userItems.map((item) => (
              <ItemCard key={item.id || item.name + item.category} item={item} owner={item.owner} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border shadow-sm">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M12 4v16"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">No Items Listed Yet</h3>
            <p className="text-gray-500 max-w-md mb-6">
              You haven't listed any items for bartering. Add your first item to start trading with the community.
            </p>
            <Button onClick={() => setOpen(true)} className="bg-barter-primary hover:bg-barter-secondary">
              <Plus className="mr-2 h-4 w-4" /> Add Your First Item
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyItems;
