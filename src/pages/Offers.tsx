import { useState } from "react";
import { useBarterContext } from "@/context/BarterContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OfferCard } from "@/components/ui/OfferCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate } from "react-router-dom";
import { Item } from "@/types";

const Offers = () => {
  const { currentUser, getPendingOffersForUser, offers, users, items } = useBarterContext();
  const [activeTab, setActiveTab] = useState("pending");

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const allUserOffers = offers.filter(
    offer => offer.fromUserId === currentUser.id || offer.toUserId === currentUser.id
  );

  const pendingOffers = getPendingOffersForUser(currentUser.id);
  const sentOffers = allUserOffers.filter(
    offer => offer.fromUserId === currentUser.id && offer.status === "pending"
  ).length;
  const receivedOffers = allUserOffers.filter(
    offer => offer.toUserId === currentUser.id && offer.status === "pending"
  ).length;
  const acceptedOffers = allUserOffers.filter(
    offer => offer.status === "accepted"
  ).length;
  const rejectedOffers = allUserOffers.filter(
    offer => offer.status === "rejected"
  ).length;

  const acceptedOffersList = allUserOffers.filter(
    offer => offer.status === "accepted"
  );

  const defaultUser = { id: '', username: 'Unknown', email: '', reputation: 0, joinedDate: '', profileImage: '' };
  const defaultItem = { id: '', name: 'Unknown Item', description: '', category: '', condition: 'Good' as Item['condition'], isAvailable: false, postedDate: '', userId: '', imageUrl: '' };
  const acceptedOffersWithDetails = acceptedOffersList.map(offer => ({
    ...offer,
    fromUser: users.find(u => u.id === offer.fromUserId) || defaultUser,
    toUser: users.find(u => u.id === offer.toUserId) || defaultUser,
    itemOffered: items.find(i => i.id === offer.itemOfferedId) || defaultItem,
    itemRequested: items.find(i => i.id === offer.itemRequestedId) || defaultItem,
  }));

  const getSortedOffers = () => {
    return [...pendingOffers].sort((a, b) => {
      // First sort by received (to show them at the top)
      if (a.toUserId === currentUser.id && b.fromUserId === currentUser.id) return -1;
      if (a.fromUserId === currentUser.id && b.toUserId === currentUser.id) return 1;
      
      // Then sort by date (newest first)
      return new Date(b.offerDate).getTime() - new Date(a.offerDate).getTime();
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-barter-primary mb-2">Offers</h1>
          <p className="text-gray-600">
            Manage your barter offers with other users
          </p>
        </div>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOffers.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-barter-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingOffers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {pendingOffers.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2 px-2">
                  <span>You have {sentOffers} sent and {receivedOffers} received pending offers</span>
                </div>
                {getSortedOffers().map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border shadow-sm">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">No Pending Offers</h3>
                <p className="text-gray-500 max-w-md">
                  You don't have any pending offers at the moment. Browse the marketplace to find items to trade.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accepted" className="mt-6">
            {acceptedOffersWithDetails.length > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-500">You have {acceptedOffersWithDetails.length} accepted offers.</p>
                {acceptedOffersWithDetails.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border shadow-sm">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">No Accepted Offers</h3>
                <p className="text-gray-500 max-w-md">
                  You haven't accepted any offers yet. Check your pending offers to start trading.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            {rejectedOffers > 0 ? (
              <div className="space-y-4">
                {/* This would be similar to pendingOffers but with rejected offers */}
                <p className="text-gray-500">You have {rejectedOffers} rejected offers.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border shadow-sm">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">No Rejected Offers</h3>
                <p className="text-gray-500 max-w-md">
                  You don't have any rejected offers. That's a good thing!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Offers;
