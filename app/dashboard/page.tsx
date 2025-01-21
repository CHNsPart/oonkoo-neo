// app/dashboard/page.tsx
"use client"
import { useEffect, useState } from 'react';
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import type { DbUser, UserApiResponse } from '@/types/user';

export default function DashboardPage() {
  const { isAuthenticated, user } = useKindeAuth();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetch('/api/user')
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: UserApiResponse) => {
          console.log('User data received:', data);
          if (data.user) {
            setDbUser(data.user);
            setError(null);
          } else {
            throw new Error('User data not found');
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated, user?.email]);

  if (!isAuthenticated) {
    return <p>Please log in to access the dashboard.</p>;
  }

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error loading user data: {error}</p>
        <p>Please try refreshing the page or logging in again.</p>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="text-red-500">
        <p>User data not found in database.</p>
        <p>Email: {user?.email}</p>
        <p>Please try logging out and logging in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-primary">
        👋 <span className="text-gray-500/50">Welcome back,</span>{' '}
        {dbUser.firstName || user?.given_name || 'User'}
      </h1>
      {dbUser.isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}