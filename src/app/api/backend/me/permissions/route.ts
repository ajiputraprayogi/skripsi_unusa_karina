import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Ambil user + roles + permissions via pivot table
  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    include: {
      user_roles: {
        include: {
          roles: {
            include: {
              role_has_permissions: {
                include: {
                  permissions: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  // Ambil roles & permissions
  const roles = user.user_roles.map(ur => ur.roles.name);
  const permissions = user.user_roles.flatMap(ur =>
    ur.roles.role_has_permissions.map(rp => rp.permissions.name)
  );

  return new Response(JSON.stringify({
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      roles,
      permissions
    }
  }));
}
