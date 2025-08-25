"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function searchUsers(query: string) {
  const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length > 0,
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2 mb-6">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading && <p>Loading...</p>}

      {users && users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {users && users.length === 0 && (
        <p>No users found.</p>
      )}
    </div>
  );
}