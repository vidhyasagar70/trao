// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Trips ────────────────────────────────────────────────────────────────────

export type BudgetType = 'budget' | 'moderate' | 'luxury';

/**
 * Each day uses morning / afternoon / evening string arrays + tips.
 * This matches the Gemini AI JSON response format.
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
  // Optional enrichment fields
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

export interface Trip {
  _id: string;
  userId: string;
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
  itinerary: DayPlan[];
  hotels: Hotel[];
  budget: BudgetBreakdown;
  packingChecklist: string[];
  /** 'gemini' = real Gemini AI | 'fallback' = hardcoded rule-based data */
  generatedBy: GenerationSource;
  generationModel: string;
  createdAt: string;
  updatedAt: string;
}

export type TripListItem = Omit<Trip, 'itinerary' | 'hotels' | 'packingChecklist'>;

// ─── API ──────────────────────────────────────────────────────────────────────

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

export interface CreateTripPayload {
  destination: string;
  numberOfDays: number;
  budgetType: BudgetType;
  interests: string[];
}
