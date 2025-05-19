import React, { useState } from "react";
import { useBarterContext } from "@/context/BarterContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProfileActions from "@/components/ui/ProfileActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserEditor } from "@/components/ui/UserEditor";
import { TradeHistory } from "@/components/ui/TradeHistory";
import { UserReputation } from "@/components/ui/UserReputation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Handshake, Star, Clock } from "lucide-react";

const Profile: React.FC = () => {
  const { currentUser, logout } = useBarterContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Modal/dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [showTradeHistory, setShowTradeHistory] = useState(false);

  // Handlers
  const handleEdit = () => setEditOpen(true);
  const handleChangePassword = () => setChangePwOpen(true);
  const handleViewMyItems = () => navigate("/my-items");
  const handleViewMyOffers = () => navigate("/offers");
  const handleViewTradeHistory = () => setShowTradeHistory((v) => !v);

  // Mock statistics - in a real app, these would come from the backend
  const userStats = {
    totalItems: 12,
    activeOffers: 3,
    completedTrades: 8,
    memberSince: "2024-01-15",
    reputationScore: 4.5,
    reviewCount: 7
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.profileImage} alt={currentUser.username} />
                <AvatarFallback>{(currentUser?.username?.charAt(0) || "?").toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{currentUser.username}</h2>
              <p className="text-gray-500">{currentUser.email}</p>
              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="text-sm text-gray-400 font-medium">Status</span>
                <span className={`text-base font-semibold px-2 py-1 rounded ${currentUser.status === 'active' ? 'text-green-600 bg-green-50' : currentUser.status === 'inactive' ? 'text-yellow-600 bg-yellow-50' : currentUser.status === 'suspended' ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100'}`}>
                  {currentUser.status ? (currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)) : 'Unknown'}
                </span>
              </div>
              <UserReputation score={userStats.reputationScore} reviewCount={userStats.reviewCount} />
              <ProfileActions
                onEdit={handleEdit}
                onChangePassword={handleChangePassword}
                onViewMyItems={handleViewMyItems}
                onViewMyOffers={handleViewMyOffers}
                onViewTradeHistory={handleViewTradeHistory}
              />
              <Button onClick={logout} variant="outline" className="mt-4 w-full">Log Out</Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="text-2xl font-bold">{userStats.totalItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Active Offers</p>
                    <p className="text-2xl font-bold">{userStats.activeOffers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Completed Trades</p>
                    <p className="text-2xl font-bold">{userStats.completedTrades}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-2xl font-bold">{new Date(userStats.memberSince).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trade History Section */}
          {showTradeHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
              </CardHeader>
              <CardContent>
                <TradeHistory userId={currentUser.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <UserEditor user={currentUser} onClose={() => setEditOpen(false)} onSave={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePwOpen} onOpenChange={setChangePwOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4">
            <input type="password" placeholder="Current Password" className="border rounded p-2" />
            <input type="password" placeholder="New Password" className="border rounded p-2" />
            <input type="password" placeholder="Confirm New Password" className="border rounded p-2" />
            <Button type="submit">Change Password</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
