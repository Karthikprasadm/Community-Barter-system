import React, { useState } from "react";
import { useBarterContext } from "@/context/BarterContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProfileActions from "@/components/ui/ProfileActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserEditor } from "@/components/ui/UserEditor";
import { TradeHistory } from "@/components/ui/TradeHistory";

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

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentUser.profileImage} alt={currentUser.username} />
          <AvatarFallback>{(currentUser?.username?.charAt(0) || "?").toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{currentUser.username}</h2>
        <p className="text-gray-500">{currentUser.email}</p>
        <div className="flex flex-col items-center gap-1 mt-2">
          <span className="text-sm text-gray-400 font-medium">Status</span>
          <span className={`text-base font-semibold px-2 py-1 rounded ${currentUser.status === 'active' ? 'text-green-600 bg-green-50' : currentUser.status === 'inactive' ? 'text-yellow-600 bg-yellow-50' : currentUser.status === 'suspended' ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100'}`}>{currentUser.status ? (currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)) : 'Unknown'}</span>
        </div>
        <ProfileActions
          onEdit={handleEdit}
          onChangePassword={handleChangePassword}
          onViewMyItems={handleViewMyItems}
          onViewMyOffers={handleViewMyOffers}
          onViewTradeHistory={handleViewTradeHistory}
        />
        <Button onClick={logout} variant="outline" className="mt-4">Log Out</Button>
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

      {/* Trade History Section */}
      {showTradeHistory && (
        <div className="mt-8">
          <TradeHistory userId={currentUser.id} />
        </div>
      )}
    </div>
  );
};

export default Profile;
