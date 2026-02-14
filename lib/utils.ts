// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const formatCurrency = (value: number, currency: string = "INR"): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateCommission = (
  propertyPrice: number,
  commissionPercentage: number
): number => {
  return (propertyPrice * commissionPercentage) / 100;
};

export const isAdmin = (role?: UserRole): boolean => role === "ADMIN";
export const isAgent = (role?: UserRole): boolean => role === "AGENT";
export const isClient = (role?: UserRole): boolean => role === "CLIENT";

export const hasPermission = (
  userRole: UserRole | undefined,
  requiredRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
};

export const getSessionUser = (session: Session | null) => {
  if (!session?.user) return null;
  return session.user;
};

export const canAccessLead = (
  leadAssignedAgentId: string | null,
  currentUserId: string,
  userRole: UserRole
): boolean => {
  if (userRole === "ADMIN") return true;
  if (leadAssignedAgentId === currentUserId) return true;
  return false;
};

export const canAccessProperty = (
  propertyAgentId: string,
  currentUserId: string,
  userRole: UserRole
): boolean => {
  if (userRole === "ADMIN") return true;
  if (propertyAgentId === currentUserId) return true;
  return false;
};

export const canManageUser = (
  targetUserRole: UserRole,
  currentUserRole: UserRole
): boolean => {
  if (currentUserRole === "ADMIN") return true;
  return false;
};

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, "").trim();
};
