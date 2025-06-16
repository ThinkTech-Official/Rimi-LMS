



import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

// Dummy stats
const stats = [
  { label: 'Total Users', value: '15,672' },
  { label: 'Created Courses', value: '25' },
  { label: 'Tests Taken', value: '315' },
  { label: 'Issued Certificates', value: '100' },
];

// Sample chart data
const lineChartData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 800 },
  { name: 'Apr', users: 500 },
  { name: 'May', users: 950 },
];

const barChartData = [
  { name: 'Jan', certificates: 50 },
  { name: 'Feb', certificates: 80 },
  { name: 'Mar', certificates: 65 },
  { name: 'Apr', certificates: 90 },
  { name: 'May', certificates: 75 },
];

// Recent users
const recentUsers = [
  { name: 'Liam Carter', email: 'liam.carter@email.com', date: 'Jan 10, 2023', certs: 1 },
  { name: 'Emma Johnson', email: 'emma.56@email.com', date: 'Feb 15, 2023', certs: 2 },
  { name: 'Noah Williams', email: 'noah.78@email.com', date: 'Mar 20, 2023', certs: 4 },
  { name: 'Olivia Brown', email: 'olivia.98@email.com', date: 'Apr 25, 2023', certs: 1 },
  { name: 'Ethan Davis', email: 'ethan.davis@email.com', date: 'May 30, 2023', certs: 3 },
  { name: 'Ava Wilson', email: 'ava.wilson@email.com', date: 'Jun 05, 2023', certs: 5 },
  { name: 'Lucas Taylor', email: 'lucas.taylor@email.com', date: 'Jul 12, 2023', certs: 2 },
  { name: 'Mason Clark', email: 'mason.@email.com', date: 'Aug 18, 2023', certs: 6 },
  { name: 'Isabella Lewis', email: 'isabella.@email.com', date: 'Sep 22, 2023', certs: 1 },
  { name: 'Sophia Walker', email: 'sophia.@email.com', date: 'Oct 28, 2023', certs: 3 },
  { name: 'Mia Hall', email: 'mia.hall@email.com', date: 'Nov 03, 2023', certs: 4 },
];

const AdminHome: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-end px-6 space-x-4">
          <button className="flex items-center gap-1 text-indigo-600">
            <GlobeAltIcon className="h-5 w-5" /> English
          </button>
          <button className="flex items-center gap-2 text-indigo-600">
            <div className="h-8 w-8 rounded-full bg-gray-200" /> Username
          </button>
        </header>

        {/* Dashboard */}
        <main className="p-6 overflow-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded shadow">
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded shadow h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="certificates" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Recently Signed up Users</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Client Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Certificates</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.email}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.certs}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-indigo-600 hover:underline">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-center p-4 space-x-2">
              <button disabled className="px-3 py-1 rounded bg-gray-300 text-gray-600" title="Previous">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded ${currentPage === num ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {num}
                </button>
              ))}
              <button className="px-3 py-1 rounded bg-gray-300 text-gray-600" title="Next">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
