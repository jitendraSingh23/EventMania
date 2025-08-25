'use client';

import { Home, Calendar, PlusCircle, Ticket, ScanLine, Search, Users } from "lucide-react";
import Link from "next/link";

interface DashboardSidebarProps {
  isExpanded: boolean;
  onExpand: (expanded: boolean) => void;
}

export function DashboardSidebar({ isExpanded, onExpand }: DashboardSidebarProps) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-40
        ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => onExpand(true)}
      onMouseLeave={() => onExpand(false)}
    >
      <nav className="flex flex-col gap-2 p-4">
        <Link href="/dashboard" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Home size={20} className="min-w-[20px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            Dashboard
          </span>
        </Link>

        <Link href="/events" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Calendar size={20} className="min-w-[20px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            Events
          </span>
        </Link>

        <Link href="/events/create" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <PlusCircle size={20} className="min-w-[20px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            Create Event
          </span>
        </Link>

        <Link href="/tickets" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Ticket size={20} className="min-w-[20px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            My Tickets
          </span>
        </Link>

        <Link href="/scanner" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <ScanLine size={20} className="min-w-[20px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            Scan Tickets
          </span>
        </Link>

        <Link href="/explore" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Search size={20} className="min-w-[20px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            Explore Events
          </span>
        </Link>

        <Link href="/attendees" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Users size={20} className="min-w-[20px]" />
          <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            Attendees
          </span>
        </Link>
      </nav>
    </aside>
  );
}
