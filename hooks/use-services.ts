"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserService } from '@/types/service';

type ServiceStatus = "pending" | "active" | "paused" | "cancelled";

interface UseServicesOptions {
  statusFilter?: ServiceStatus | null;
}

export function useServices(options: UseServicesOptions = {}) {
  const { statusFilter = null } = options;
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/services?status=${statusFilter}`
        : '/api/services';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const mutate = useCallback(async () => {
    await fetchServices();
  }, [fetchServices]);

  // Activate a service (admin only)
  const activateService = useCallback(async (serviceId: string, adminNotes?: string) => {
    const response = await fetch(`/api/services/${serviceId}/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNotes }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to activate service');
    }

    await fetchServices();
    return response.json();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    mutate,
    activateService,
  };
}
