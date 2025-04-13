
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Star, StarOff, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserReputationProps {
  score: number;
  reviewCount?: number;
  showTooltip?: boolean;
}

export const UserReputation: React.FC<UserReputationProps> = ({ 
  score, 
  reviewCount = 0,
  showTooltip = true 
}) => {
  // Ensure score is a valid number
  const safeScore = !isNaN(Number(score)) ? Number(score) : 0;
  
  const getReputationLabel = () => {
    if (safeScore < 2) return "Newcomer";
    if (safeScore < 5) return "Trusted";
    if (safeScore < 10) return "Reliable";
    return "Community Leader";
  };

  const getReputationColor = () => {
    if (safeScore < 2) return "secondary";
    if (safeScore < 5) return "default";
    if (safeScore < 10) return "outline";
    return "destructive";
  };

  const getStars = () => {
    const fullStars = Math.floor(safeScore);
    const hasHalfStar = safeScore - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        ))}
        {hasHalfStar && (
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 opacity-50" />
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <StarOff key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
        ))}
      </div>
    );
  };

  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      <p className="font-medium">{getReputationLabel()} ({safeScore.toFixed(1)})</p>
      {getStars()}
      <p className="text-xs text-gray-400">Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</p>
      <p className="text-xs">
        The reputation score reflects how trusted this user is in the community 
        based on successful trades and positive reviews.
      </p>
    </div>
  );

  const reputationDisplay = (
    <Badge variant={getReputationColor()} className="flex items-center gap-1">
      <Star className="h-3 w-3" />
      <span>{getReputationLabel()} ({safeScore.toFixed(1)})</span>
    </Badge>
  );

  if (!showTooltip) {
    return reputationDisplay;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            {reputationDisplay}
            <Info className="h-3 w-3 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white p-3 shadow-lg rounded-md border">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
