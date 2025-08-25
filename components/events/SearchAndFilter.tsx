import { Search } from "lucide-react";

export function SearchAndFilter() {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <select className="border rounded-lg px-4 py-2">
          <option value="">All Categories</option>
          <option value="music">Music</option>
          <option value="tech">Tech</option>
          <option value="sports">Sports</option>
          <option value="business">Business</option>
        </select>
        
        <select className="border rounded-lg px-4 py-2">
          <option value="">Date Range</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
  );
}
