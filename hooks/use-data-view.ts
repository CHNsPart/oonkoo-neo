"use client";

import { useReducer, useCallback } from 'react';
import { DataViewState, DataViewAction, FilterConfig, SortConfig } from '@/types/dashboard';

const initialState: DataViewState = {
  view: 'list',
  filters: {},
  search: '',
  page: 1
};

function reducer(state: DataViewState, action: DataViewAction): DataViewState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, page: 1 };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useDataView() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setView = useCallback((view: 'grid' | 'list') => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const setSort = useCallback((sort: SortConfig) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  const setFilters = useCallback((filters: FilterConfig) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    setView,
    setSort,
    setFilters,
    setSearch,
    setPage,
    reset
  };
}