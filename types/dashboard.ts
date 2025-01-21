import { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  format?: (value: any) => string | ReactNode;
  hideInCard?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface DataViewProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onDelete: (id: string) => Promise<void>;
  resourceName: string;
  pageSize?: number;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: string[];
}

export interface DataViewState {
  view: 'grid' | 'list';
  sort?: SortConfig;
  filters: FilterConfig;
  search: string;
  page: number;
}

export type DataViewAction =
  | { type: 'SET_VIEW'; payload: 'grid' | 'list' }
  | { type: 'SET_SORT'; payload: SortConfig }
  | { type: 'SET_FILTERS'; payload: FilterConfig }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET' };