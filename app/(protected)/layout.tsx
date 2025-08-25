'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar 
        isExpanded={isExpanded}
        onExpand={setIsExpanded}
      />
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="h-full max-w-[1600px] w-full mx-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
