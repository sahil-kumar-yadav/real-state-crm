// lib/validations.ts
import { z } from "zod";

// Authentication
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  phone: z.string().min(10, "Valid phone number required"),
});

// Properties
export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  type: z.enum(["APARTMENT", "VILLA", "COMMERCIAL", "LAND", "HOUSE", "PENTHOUSE"]),
  status: z.enum(["AVAILABLE", "SOLD", "RENTED", "UNDER_OFFER", "OFF_MARKET"]).default("AVAILABLE"),
  address: z.string().min(5, "Valid address required"),
  city: z.string().min(2, "City required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("India"),
  price: z.number().positive("Price must be greater than 0"),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  squareFeet: z.number().positive().optional(),
  furnishedStatus: z.enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]).default("UNFURNISHED"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
  agentId: z.string().min(1, "Agent must be assigned"),
});

// Leads
export const leadSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number required"),
  type: z.enum(["BUYER", "SELLER", "RENTER"]).default("BUYER"),
  source: z.enum(["FACEBOOK", "WEBSITE", "WHATSAPP", "REFERRAL", "PHONE_CALL", "EMAIL", "OTHER"]),
  status: z.enum(["NEW", "CONTACTED", "INTERESTED", "SITE_VISIT_SCHEDULED", "NEGOTIATING", "CLOSED_WON", "CLOSED_LOST", "DEAD"]).default("NEW"),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  interestedPropertyId: z.string().optional(),
  notes: z.string().optional(),
});

// Property Visits
export const propertyVisitSchema = z.object({
  leadId: z.string().min(1, "Lead ID required"),
  propertyId: z.string().min(1, "Property ID required"),
  assignedAgentId: z.string().min(1, "Agent assignment required"),
  scheduledAt: z.string().datetime("Invalid date format"),
  notes: z.string().optional(),
});

// Update Visit Status
export const updateVisitStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "COMPLETED", "NO_SHOW", "RESCHEDULED", "CANCELLED"]),
  feedback: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

// Activity
export const activitySchema = z.object({
  leadId: z.string().min(1, "Lead ID required"),
  type: z.enum(["CALL", "EMAIL", "WHATSAPP", "SMS", "MEETING", "SITE_VISIT", "PROPOSAL_SENT", "NOTE"]),
  title: z.string().min(3, "Title required"),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type PropertyVisitInput = z.infer<typeof propertyVisitSchema>;
export type UpdateVisitStatusInput = z.infer<typeof updateVisitStatusSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
