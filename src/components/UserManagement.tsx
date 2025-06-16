import React, { useState } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  course: string;
  progress: string;
  certificateIssued: boolean;
}

const sampleUsers: User[] = [
  { id: 1, name: 'Liam Carter', email: 'liam.carter@email.com', course: 'Course 1', progress: '100%', certificateIssued: true },
  { id: 2, name: 'Emma Johnson', email: 'emma.56@email.com', course: 'Course 2', progress: '75%', certificateIssued: false },
  { id: 3, name: 'Noah Williams', email: 'noah.78@email.com', course: 'Course 3', progress: '90%', certificateIssued: false },
  
];

export const UserManagement: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'certified'>('all');
  const [search, setSearch] = useState('');

  const filtered = sampleUsers.filter(u => {
    const matchesFilter = filter === 'all' || (filter === 'certified' && u.certificateIssued);
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative bg-white overflow-hidden min-h-screen">
      <div className="px-6 py-4">
        <h2 className="text-indigo-800 text-sm font-medium mb-2">&gt; Users Management </h2>
        <h1 className="text-zinc-900 text-lg font-bold mb-4">Users</h1>
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-zinc-900">Show</span>
          <div className="bg-gray-200 rounded-md px-4 py-2">
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filter === 'all'}
                onChange={() => setFilter('all')}
                className="form-radio text-indigo-800"
              />
              <span className="ml-2">All Users</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="filter"
                value="certified"
                checked={filter === 'certified'}
                onChange={() => setFilter('certified')}
                className="form-radio text-indigo-800"
              />
              <span className="ml-2">Certified Users</span>
            </label>
          </div>
          <div className="ml-auto w-64 relative">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-4"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-indigo-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Client Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Progress</th>
                <th className="px-6 py-3 text-left">Certificate Issued</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-zinc-700">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-zinc-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-zinc-700">{user.course}</td>
                  <td className="px-6 py-4 text-sm text-zinc-700">{user.progress}</td>
                  <td className="px-6 py-4 text-sm text-zinc-700">{user.certificateIssued ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-indigo-800 underline">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination stub */}
        <div className="mt-6 flex justify-center">
          <button className="px-4 py-2 bg-stone-300 rounded-l">Previous</button>
          <button className="px-4 py-2 bg-indigo-800 text-white">1</button>
          <button className="px-4 py-2 bg-gray-100">2</button>
          <button className="px-4 py-2 bg-stone-300 rounded-r">Next</button>
        </div>
      </div>
    </div>
  );
};