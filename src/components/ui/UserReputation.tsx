
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface UserReputationProps {
  score: number;
}

export const UserReputation: React.FC<UserReputationProps> = ({ score }) => {
  const getReputationLabel = () => {
    if (score < 2) return "Newcomer";
    if (score < 5) return "Trusted";
    if (score < 10) return "Reliable";
    return "Community Leader";
  };

  const getReputationColor = () => {
    if (score < 2) return "secondary";
    if (score < 5) return "default";
    if (score < 10) return "outline";
    return "destructive";
  };

  return (
    <div className="flex items-center gap-2">
      <Star className="h-4 w-4 text-yellow-500" />
      <Badge variant={getReputationColor()}>
        {getReputationLabel()} ({score.toFixed(1)})
      </Badge>
    </div>
  );
};
