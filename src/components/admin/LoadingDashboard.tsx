
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";

export const LoadingDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
        
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="h-80 w-full" />
      </main>
    </div>
  );
};
