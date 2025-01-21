"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export interface SaleInquiry {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  description: string | null;
  meetingTime: Date | null;
  saleId: string;
  type: string;
  originalPrice: number;
  salePrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useSales() {
  const [sales, setSales] = useState<SaleInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const fetchingRef = useRef(false);

  const fetchSales = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      setLoading(true);
      const response = await fetch('/api/sale-inquiries');
      if (!response.ok) {
        throw new Error('Failed to fetch sales');
      }
      const data = await response.json();
      
      if (mountedRef.current) {
        setSales(data.inquiries || []);
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
    fetchSales();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchSales]);

  const mutate = useCallback(async () => {
    await fetchSales();
  }, [fetchSales]);

  return {
    sales,
    loading,
    error,
    mutate,
  };
}