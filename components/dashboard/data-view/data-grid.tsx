// components/dashboard/data-view/data-grid.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Edit2, Trash2, Search, Eye } from "lucide-react";
import Link from "next/link";
import { TableColumn } from "@/types/dashboard";
import { Pagination } from "./pagination";
import ConfirmationModal from "./confirmation-modal";
import ProjectDetailsModal from "../projects/project-details-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

interface DataGridProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onDelete: (id: string) => Promise<void>;
  resourceName: string;
  pageSize?: number;
  DetailsModal?: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: T | null;
  }>;
  showDetailsButton?: boolean;
}

export default function DataGrid<T extends { id: string }>({
  data,
  columns,
  onDelete,
  resourceName,
  pageSize = 10,
  DetailsModal,
  showDetailsButton = false
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { user } = useKindeAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setIsAdmin(data.user?.isAdmin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    if (user?.email) {
      checkAdmin();
    }
  }, [user?.email]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setLoading(true);
    try {
      await onDelete(deleteId);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        />
      </div>

      {/* Table */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5">
                {columns.map((column) => (
                  <th
                    key={column.key as string}
                    className="px-6 py-3 text-left text-sm font-medium text-white/70"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-sm font-medium text-white/70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {paginatedData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className="px-6 py-4 text-sm text-white/70"
                    >
                      {column.format
                        ? column.format(item[column.key as keyof T])
                        : String(item[column.key as keyof T])}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="inline-flex items-center justify-center p-2 text-white/70 hover:text-brand-primary rounded-xl transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-48 p-2 bg-black/90 backdrop-blur-xl rounded-xl border-brand-primary/50">
                        {(showDetailsButton || resourceName === 'project') && (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setDetailsModalOpen(true);
                            }}
                            className="flex items-center w-full gap-2 p-2 text-white/70 hover:text-brand-primary hover:bg-white/10 rounded-[0.5rem] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Details</span>
                          </button>
                        )}
                        <Link
                          href={`/dashboard/${resourceName}s/${item.id}/edit`}
                          className="flex items-center w-full gap-2 p-2 text-white/70 hover:text-brand-primary hover:bg-white/10 rounded-[0.5rem] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="flex items-center w-full gap-2 p-2 text-white/70 hover:text-red-500 hover:bg-red-500/10 rounded-[0.5rem] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal 
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        description={`Are you sure you want to delete this ${resourceName}? This action cannot be undone.`}
        loading={loading}
      />

      {/* Render custom Details Modal or fallback to Project Details Modal */}
      {DetailsModal ? (
        <DetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          data={selectedItem}
        />
      ) : resourceName === 'project' && (
        <ProjectDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          project={selectedItem as any}
        />
      )}
    </div>
  );
}