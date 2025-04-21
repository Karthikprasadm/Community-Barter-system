import React from "react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

interface ProfileActionsProps {
  onEdit: () => void;
  onChangePassword: () => void;
  onViewMyItems: () => void;
  onViewMyOffers: () => void;
  onViewTradeHistory: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  onEdit,
  onChangePassword,
  onViewMyItems,
  onViewMyOffers,
  onViewTradeHistory
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      <Button onClick={onEdit} variant="default">Edit Profile</Button>
      <Button onClick={onChangePassword} variant="outline">Change Password</Button>
      <Button onClick={onViewMyItems} variant="outline">My Items</Button>
      <Button onClick={onViewMyOffers} variant="outline">My Offers</Button>
      <Button onClick={onViewTradeHistory} variant="outline">Trade History</Button>
    </div>
  );
};

export default ProfileActions;
