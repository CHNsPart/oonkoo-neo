// types/client.ts
import { User } from "@prisma/client";
import type { TableColumn } from "@/types/dashboard";

export type ClientUser = User;

// Re-export the TableColumn type with our ClientUser
export type ClientTableColumn = TableColumn<ClientUser>;