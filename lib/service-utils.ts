import { prisma } from "@/lib/prisma";
import { getEffectivePermissions, hasPermission } from "@/lib/permissions";
import { Role, Permission } from "@/types/permissions";

export async function canModifyService(userEmail: string, serviceId: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, role: true, permissions: true },
  });

  if (!user) return false;

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  // Users with MANAGE_SERVICES can modify any service
  if (hasPermission(effectivePermissions, "MANAGE_SERVICES")) {
    return true;
  }

  // Otherwise, users can only modify their own services
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { userEmail: true },
  });

  return service?.userEmail === userEmail;
}

export async function isServiceStatusChangeAllowed(
  userEmail: string,
  status: string
) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { role: true, permissions: true },
  });

  if (!user) return false;

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  // Users with MANAGE_SERVICES can change to any status
  if (hasPermission(effectivePermissions, "MANAGE_SERVICES")) {
    return true;
  }

  // Regular users can only pause or cancel their services
  return ["paused", "cancelled"].includes(status);
}
