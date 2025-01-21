"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Search } from "lucide-react";
import Link from "next/link";

interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  format?: (value: any) => string;
}

interface DataTableProps {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  data: any[];
  columns: Column[];
  onDelete: (id: string) => void;
  resourceName: string;
}

export default function DataTable({
  data,
  columns,
  onDelete,
  resourceName,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              {columns.map((column) => (
                <th
                  key={column.key}
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
            {filteredData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm text-white/70"
                  >
                    {column.format
                      ? column.format(item[column.key])
                      : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm text-right space-x-2">
                  <Link
                    href={`/dashboard/${resourceName}s/${item.id}/edit`}
                    className="inline-flex items-center justify-center p-2 text-white/70 hover:text-brand-primary rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="inline-flex items-center justify-center p-2 text-white/70 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}