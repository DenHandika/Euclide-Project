import type { UserRole } from "@/types";

export const roleHome: Record<UserRole, string> = {
  siswa: "/dashboard",
  tentor: "/tentor",
  admin: "/admin",
};
