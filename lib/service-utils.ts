import { prisma } from "@/lib/prisma";

export async function canModifyService(userEmail: string, serviceId: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) return false;
  if (user.isAdmin) return true;

  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  // Users can only modify their own services' status
  return service?.userEmail === userEmail;
}

export async function isServiceStatusChangeAllowed(userEmail: string, status: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) return false;
  if (user.isAdmin) return true;

  return ['paused', 'cancelled'].includes(status);
}