"use client";

import { useState, useEffect, useCallback } from 'react';
import { ClientUser } from '@/types/client';

export function useClients() {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data.clients || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const mutate = useCallback(async () => {
    await fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    mutate,
  };
}