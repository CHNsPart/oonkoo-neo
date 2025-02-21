"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserService } from '@/types/service';

export function useServices() {
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
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
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const mutate = useCallback(async () => {
    await fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    mutate,
  };
}