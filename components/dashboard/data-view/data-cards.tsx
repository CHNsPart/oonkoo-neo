// components/dashboard/data-view/data-cards.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Edit2, Trash2, Eye, Search } from "lucide-react";
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

interface DataCardsProps<T> {
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

export default function DataCards<T extends { id: string }>({
  data,
  columns,
  onDelete,
  resourceName,
  pageSize = 12,
  DetailsModal,
  showDetailsButton = false
}: DataCardsProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<T | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useKindeAuth();
  const [isAdmin, setIsAdmin] = useState(false);

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
    <div className="space-y-6">
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:border-brand-primary/50 transition-colors"
          >
            {/* Card Content */}
            <div className="space-y-4">
              {/* Actions */}
              <div className="flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center justify-center p-2 text-white/70 hover:text-brand-primary rounded-xl transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2 bg-black/90 backdrop-blur-xl rounded-xl border-brand-primary/50">
                    {(showDetailsButton || resourceName === 'project') && (
                      <button
                        onClick={() => {
                          setSelectedProject(item);
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
              </div>

              {/* Card Fields */}
              {columns.map((column) => {
                if (column.hideInCard) return null;
                const value = item[column.key as keyof T];
                return (
                  <div key={column.key as string}>
                    <div className="text-sm text-white/50 mb-1">{column.label}</div>
                    <div className="text-white">
                      {column.format ? column.format(value) : String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
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
          data={selectedProject}
        />
      ) : resourceName === 'project' && (
        <ProjectDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          project={selectedProject as any}
        />
      )}
    </div>
  );
}