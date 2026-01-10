"use client";

import { useState, useEffect } from 'react';
import { ServiceFormLayout } from './shared/service-form-layout';
import { UserServiceForm } from './user-service-form';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { UserService } from '@/types/service';
import { api } from '@/lib/api';
import { AdminServiceForm } from './admin-service-form';

interface ServiceFormProps {
  initialData?: Partial<UserService>;
  onSubmit: (data: Partial<UserService>) => Promise<void>;
  mode: 'create' | 'edit';
}

export function ServiceForm({ initialData, onSubmit, mode }: ServiceFormProps) {
  const { user } = useKindeAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.email) {
        const { user: dbUser } = await api.getUser();
        // Check for MANAGE_SERVICES permission or ADMIN/SUPER_ADMIN role
        const role = dbUser?.role || "VIEWER";
        const permissions = dbUser?.permissions || [];
        const canManageServices =
          role === "ADMIN" ||
          role === "SUPER_ADMIN" ||
          permissions.includes("MANAGE_SERVICES") ||
          dbUser?.isAdmin;
        setIsAdmin(canManageServices);
      }
    };
    checkAdmin();
  }, [user?.email]);

  const processedInitialData = initialData ? {
    ...initialData,
    serviceId: initialData.serviceId || 'maintenance',
  } : undefined;

  return (
    <ServiceFormLayout isAdmin={isAdmin}>
      {isAdmin ? (
        <AdminServiceForm
          initialData={processedInitialData}
          onSubmit={onSubmit}
          mode={mode}
        />
      ) : (
        <UserServiceForm
          initialData={processedInitialData}
          onSubmit={onSubmit}
          mode={mode}
        />
      )}
    </ServiceFormLayout>
  );
}