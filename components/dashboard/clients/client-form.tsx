"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientUser } from "@/types/client";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, Role } from "@/types/permissions";
import { usePermissions } from "@/hooks/use-permissions";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ClientFormProps {
  initialData?: Partial<ClientUser & { role?: Role }>;
  onSubmit: (data: Partial<ClientUser & { role?: Role }>) => Promise<void>;
  mode: "create" | "edit";
}

export function ClientForm({ initialData, onSubmit, mode }: ClientFormProps) {
  const { isSuperAdmin } = usePermissions();
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    role: (initialData?.role as Role) || "VIEWER",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await onSubmit(formData);
      setStatus("success");

      // Show success message for 2 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  // Filter roles - don't allow assigning SUPER_ADMIN
  const availableRoles = ROLES.filter((r) => r !== "SUPER_ADMIN");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name *"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name *"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={mode === "edit"}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {isSuperAdmin && (
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value as Role }))
              }
            >
              <SelectTrigger className="w-full px-4 py-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role} className="rounded-xl">
                    <div className="flex flex-col">
                      <span>{ROLE_LABELS[role]}</span>
                      <span className="text-xs text-white/50">
                        {ROLE_DESCRIPTIONS[role]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Role Info */}
      {isSuperAdmin && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Role & Permissions</h3>
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
            <p className="text-sm text-white/70">
              The selected role determines default permissions. You can customize
              individual permissions in the Settings page after creating the user.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button and Status */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <AnimatePresence mode="wait">
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center justify-center sm:justify-start gap-2"
            >
              {status === "success" && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                  <span className="text-brand-primary">
                    Client {mode === "create" ? "created" : "updated"}{" "}
                    successfully!
                  </span>
                </>
              )}
              {status === "error" && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">{errorMessage}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <HoverBorderGradient
          type="submit"
          disabled={status === "submitting"}
          className="w-full sm:w-auto cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {status === "submitting" ? (
              <>
                {mode === "create" ? "Creating..." : "Updating..."}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </>
            ) : (
              <>
                {mode === "create" ? "Create Client" : "Update Client"}{" "}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </HoverBorderGradient>
      </div>
    </form>
  );
}
