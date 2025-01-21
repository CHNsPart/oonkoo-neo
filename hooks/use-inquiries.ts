"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export interface ProjectInquiry {
  id: string;
  name: string | null;
  company: string | null;
  email: string;
  phone: string | null;
  budget: number | null;
  description: string | null;
  meetingTime: Date | null;
  project: string;
  type: string;
  status: string;
  origin: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useInquiries() {
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const fetchingRef = useRef(false);

  const fetchInquiries = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);
      const response = await fetch('/api/project-inquiries');
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }
      const data = await response.json();
      
      // Only update state if the component is still mounted
      if (mountedRef.current) {
        setInquiries(data.inquiries || []);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    fetchInquiries();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchInquiries]);

  const mutate = useCallback(async () => {
    await fetchInquiries();
  }, [fetchInquiries]);

  return {
    inquiries,
    loading,
    error,
    mutate,
  };
}