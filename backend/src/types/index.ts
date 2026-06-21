import { Request } from 'express';
import { Types } from 'mongoose';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export type BudgetType = 'budget' | 'moderate' | 'luxury';

/**
 * Each day is structured with morning / afternoon / evening activity lists
 * and a short travel tips string — matching the Gemini AI response format.
 */
export interface DayPlan {
  day: number;
  title: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  tips: string;
}

export interface Hotel {
  name: string;
  rating: number;
  description: string;
  // Optional enrichment fields (kept for display flexibility)
  pricePerNight?: number;
  address?: string;
  amenities?: string[];
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  total: number;
  currency: string;
}

export type GenerationSource = 'gemini' | 'fallback';

export interface ITrip {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
  itinerary: DayPlan[];
  hotels: Hotel[];
  budget: BudgetBreakdown;
  packingChecklist: string[];
  /** 'gemini' = real AI response | 'fallback' = hardcoded rule-based data */
  generatedBy: GenerationSource;
  /** e.g. 'gemini-1.5-flash' or 'rule-based-engine' */
  generationModel: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request Bodies ────────────────────────────────────────────────────────────

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateTripBody {
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
}

export interface UpdateDayBody {
  dayPlan: DayPlan;
}

// ─── API Responses ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
