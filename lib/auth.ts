import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/session";

export async function getCurrentUser() {
  const store = await cookies();
  const session = decodeSession(store.get(AUTH_COOKIE_NAME)?.value);

  if (!session) {
    return null;
  }

  return db.user.findUnique({
    where: { id: session.userId },
    include: { employee: true }
  });
}

export async function requireUser(role?: Role) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (role && user.role !== role) {
    redirect("/unauthorized");
  }

  return user;
}
