"use client";

import { useState, useEffect, useCallback } from "react";
import { ClientUser } from "@/types/client";

export function useClients() {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/clients");

      // Handle 403 Forbidden gracefully - user doesn't have permission
      if (response.status === 403) {
        setClients([]);
        setHasPermission(false);
        setError(null); // Don't show error for permission issues
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      setClients(data.clients || []);
      setHasPermission(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setClients([]);
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
    hasPermission,
    mutate,
  };
}
