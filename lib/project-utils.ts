import { prisma } from "@/lib/prisma";

export async function canModifyProject(userEmail: string, projectId: string) {
  // Get user
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) return false;

  // Admins can modify all projects
  if (user.isAdmin) return true;

  // Users can only modify their own projects
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  return project?.userId === user.id;
}