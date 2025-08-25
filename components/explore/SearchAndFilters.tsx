'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchAndFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearch = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/explore?${newParams.toString()}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search events..."
          className="pl-10"
          defaultValue={searchParams.get('search') ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            updateSearch({ search: value });
          }}
        />
      </div>

      <Select 
        defaultValue={searchParams.get('category') ?? 'all'}
        onValueChange={(value) => updateSearch({ category: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="CONFERENCE">Conference</SelectItem>
          <SelectItem value="WORKSHOP">Workshop</SelectItem>
          <SelectItem value="MEETUP">Meetup</SelectItem>
          <SelectItem value="CONCERT">Concert</SelectItem>
          <SelectItem value="EXHIBITION">Exhibition</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        defaultValue={searchParams.get('price') ?? 'all'}
        onValueChange={(value) => updateSearch({ price: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Price</SelectItem>
          <SelectItem value="1000">Under ₹1,000</SelectItem>
          <SelectItem value="5000">Under ₹5,000</SelectItem>
          <SelectItem value="10000">Under ₹10,000</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
