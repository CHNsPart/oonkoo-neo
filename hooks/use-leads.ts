// hooks/use-leads.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const mutate = useCallback(async () => {
    await fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    mutate,
  };
}