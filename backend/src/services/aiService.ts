import { GoogleGenerativeAI } from '@google/generative-ai';
import { BudgetType, DayPlan, Hotel, BudgetBreakdown } from '../types';
import { env } from '../config/env';

// ─── Gemini Client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// ─── Gemini Response Shape ────────────────────────────────────────────────────
// This mirrors the JSON format we ask Gemini to return
interface GeminiResponse {
  destination: string;
  days: number;
  itinerary: Array<{
    day: number;
    title: string;
    morning: string[];
    afternoon: string[];
    evening: string[];
    tips: string;
  }>;
  budget: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    total: number;
    currency: string;
  };
  hotels: Array<{
    name: string;
    rating: number;
    description: string;
  }>;
  packingChecklist: string[];
}

// ─── Build the Gemini Prompt ──────────────────────────────────────────────────
const buildPrompt = (
  destination: string,
  days: number,
  budgetType: BudgetType,
  interests: string[]
): string => `
You are an expert AI Travel Planner.

Generate a realistic travel plan based on the user's preferences.

Destination: ${destination}
Number of Days: ${days}
Budget Type: ${budgetType}
Interests: ${interests.join(', ')}

Requirements:
1. Create a day-by-day itinerary.
2. Each day must have:
   * Title
   * Morning activities (array of strings)
   * Afternoon activities (array of strings)
   * Evening activities (array of strings)
   * Short travel tips (single string)
3. Estimate the trip budget including:
   * Accommodation (USD total for all nights)
   * Food (USD total for all days)
   * Transportation (USD total)
   * Activities (USD total)
   * Total (sum of all above)
4. Recommend 3 hotels suitable for the selected budget type (${budgetType}):
   * Hotel Name
   * Rating (1-5)
   * Short Description
5. Recommend a packing checklist (array of strings).
6. Ensure all recommendations are realistic and specific to ${destination}.

IMPORTANT:
- Return ONLY valid JSON, no markdown, no code fences, no extra text.
- All numbers must be integers.
- Ratings must be between 1 and 5.
- The itinerary array must have exactly ${days} entries.

JSON FORMAT:
{
  "destination": "${destination}",
  "days": ${days},
  "itinerary": [
    {
      "day": 1,
      "title": "",
      "morning": ["activity 1", "activity 2"],
      "afternoon": ["activity 3", "activity 4"],
      "evening": ["activity 5"],
      "tips": "Short practical tip for this day"
    }
  ],
  "budget": {
    "accommodation": 0,
    "food": 0,
    "transportation": 0,
    "activities": 0,
    "total": 0,
    "currency": "USD"
  },
  "hotels": [
    {
      "name": "",
      "rating": 4,
      "description": ""
    }
  ],
  "packingChecklist": ["item 1", "item 2"]
}
`;

// ─── Call Gemini API ──────────────────────────────────────────────────────────
const callGemini = async (
  destination: string,
  days: number,
  budgetType: BudgetType,
  interests: string[]
): Promise<GeminiResponse> => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildPrompt(destination, days, budgetType, interests);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip any accidental markdown code fences
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned) as GeminiResponse;

  // Basic validation
  if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
    throw new Error('Gemini response missing itinerary array');
  }
  if (!parsed.budget || typeof parsed.budget.total !== 'number') {
    throw new Error('Gemini response missing valid budget');
  }

  return parsed;
};

// ─── Fallback: Rule-Based Generator ──────────────────────────────────────────
// Used when Gemini is unavailable or returns an invalid response.
// This ensures the app always works even without an API key.

const BUDGET_MULTIPLIER: Record<BudgetType, number> = {
  budget: 1,
  moderate: 2.2,
  luxury: 5,
};

const FALLBACK_ACTIVITIES: Record<string, { morning: string[]; afternoon: string[]; evening: string[] }> = {
  culture: {
    morning: ['Visit the local history museum', 'Explore the old town quarter', "Tour the city's iconic landmarks"],
    afternoon: ['Guided heritage walking tour', 'Traditional arts & crafts workshop', 'Visit an ancient temple or monument'],
    evening: ['Attend a local cultural performance', 'Stroll the illuminated old quarter', 'Dinner at a heritage restaurant'],
  },
  food: {
    morning: ['Browse the vibrant local food market', 'Morning street food tour with a local guide'],
    afternoon: ['3-hour cooking class — learn to cook signature local dishes', 'Visit a spice market or local brewery'],
    evening: ['Street food night market tour', 'Dinner at a highly-rated local restaurant', 'Dessert crawl through the city'],
  },
  adventure: {
    morning: ['Sunrise hike on a scenic trail', 'Mountain biking excursion', 'Early morning kayaking session'],
    afternoon: ['White-water rafting or water sports', 'Zip-lining through the jungle canopy', 'Rock climbing with a local guide'],
    evening: ['Bonfire and barbecue at the campsite', 'Stargazing session outside the city', 'Evening cycling tour'],
  },
  nature: {
    morning: ['Botanical garden guided walk', 'Bird-watching in a nature reserve', 'Sunrise at a scenic viewpoint'],
    afternoon: ['Wildlife safari in the national park', 'Boat trip through mangroves or wetlands', 'Waterfall hike'],
    evening: ['Sunset at the beach or lake shore', 'Visit a night-time nature reserve', 'Eco-lodge dinner'],
  },
  shopping: {
    morning: ['Explore the artisan morning market', 'Shop for local handicrafts in the old bazaar'],
    afternoon: ['Browse designer boutiques in the shopping district', 'Visit a local factory or workshop showroom'],
    evening: ['Night market for souvenirs', 'Visit a department store or mall', 'Antique street shopping'],
  },
  relaxation: {
    morning: ['Sunrise yoga or meditation session', 'Leisurely breakfast on the hotel terrace', 'Morning walk along the waterfront'],
    afternoon: ['Spa & full-body massage treatment', 'Floating in a thermal pool or hammam', 'Lazy afternoon by the pool'],
    evening: ['Sunset cocktails at a rooftop bar', 'Candlelit dinner at a fine restaurant', 'Gentle evening stroll along the promenade'],
  },
};

const FALLBACK_MEALS: Record<BudgetType, string[]> = {
  budget: ['Street food stalls', 'Local market rice bowls', 'Budget-friendly cafés', 'Night market vendors'],
  moderate: ['Bistro lunch specials', 'Rooftop cafés with city views', 'Award-winning noodle houses'],
  luxury: ["Michelin-starred dining", "Private chef experiences", "Rooftop champagne dinners"],
};

const FALLBACK_HOTELS: Record<BudgetType, Hotel[]> = {
  budget: [
    { name: 'The Wanderer Hostel', rating: 3, description: 'A lively hostel in the city center perfect for budget travelers seeking community.', pricePerNight: 25 },
    { name: 'City Budget Inn', rating: 3, description: 'Clean, comfortable rooms near public transit — great value for money.', pricePerNight: 40 },
    { name: 'Backpacker\'s Central', rating: 3, description: 'Social atmosphere, free WiFi, and shared kitchen. Great for solo travelers.', pricePerNight: 30 },
  ],
  moderate: [
    { name: 'City Comfort Hotel', rating: 4, description: 'Modern 4-star hotel with pool and gym, ideal for the savvy traveler.', pricePerNight: 120 },
    { name: 'The Boutique Collection', rating: 4, description: 'Charming boutique hotel in the historic quarter with personalized service.', pricePerNight: 150 },
    { name: 'Skyline Residence Hotel', rating: 4, description: 'Stunning city views, rooftop bar, and a convenient central location.', pricePerNight: 135 },
  ],
  luxury: [
    { name: 'The Grand Prestige', rating: 5, description: 'Iconic 5-star waterfront hotel with butler service, infinity pool, and Michelin-star dining.', pricePerNight: 450 },
    { name: 'Pinnacle Suites & Residences', rating: 5, description: 'Ultra-luxury hilltop suites with a private chef and limousine service.', pricePerNight: 650 },
    { name: 'Royal Palace Hotel', rating: 5, description: 'A palatial 5-star property with private beach access and world-class spa.', pricePerNight: 520 },
  ],
};

const PACKING_CHECKLIST_BASE = [
  'Valid passport and travel insurance documents',
  'Local currency and credit/debit cards',
  'Comfortable walking shoes',
  'Weather-appropriate clothing (check local forecast)',
  'Universal power adapter',
  'Portable phone charger / power bank',
  'Sunscreen and insect repellent',
  'Basic first-aid kit (pain relievers, plasters, antidiarrheal)',
  'Reusable water bottle',
  'Offline maps downloaded (Google Maps or Maps.me)',
  'Earbuds / noise-cancelling headphones',
  'Camera or phone with extra storage',
  'Daypack / small backpack',
  'Snacks for travel days',
];

const DAY_THEMES = [
  'Arrival & First Impressions',
  'Deep Dive into Local Culture',
  'Hidden Gems Discovery',
  'Adventure Day',
  'Gastronomic Journey',
  'Art & Architecture Exploration',
  'Nature & Outdoors',
  'Shopping & Souvenirs',
  'Day Trip & Excursion',
  'Relaxation & Wellness',
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const buildFallbackItinerary = (
  destination: string,
  numberOfDays: number,
  budgetType: BudgetType,
  interests: string[]
): DayPlan[] => {
  return Array.from({ length: numberOfDays }, (_, i) => {
    const dayNumber = i + 1;
    const theme = DAY_THEMES[i % DAY_THEMES.length]!;
    const primary = interests[i % interests.length]?.toLowerCase() ?? 'culture';
    const secondary = interests[(i + 1) % interests.length]?.toLowerCase() ?? 'food';

    const pActs = FALLBACK_ACTIVITIES[primary] ?? FALLBACK_ACTIVITIES['culture']!;
    const sActs = FALLBACK_ACTIVITIES[secondary] ?? FALLBACK_ACTIVITIES['food']!;
    const meals = FALLBACK_MEALS[budgetType];

    return {
      day: dayNumber,
      title:
        dayNumber === 1
          ? `Welcome to ${destination} — ${theme}`
          : dayNumber === numberOfDays
          ? `Farewell ${destination} — ${theme}`
          : `${destination} Day ${dayNumber} — ${theme}`,
      morning: pActs.morning.slice(0, 2),
      afternoon: sActs.afternoon.slice(0, 2),
      evening: pActs.evening.slice(0, 2),
      tips:
        dayNumber === 1
          ? `Arrive early and check in. Grab a local SIM card and explore the area near your ${budgetType === 'luxury' ? 'hotel' : 'accommodation'} before your first meal.`
          : dayNumber === numberOfDays
          ? `Pack the night before. Allow 3 hours for airport travel. Enjoy a final meal at: ${pick(meals)}.`
          : `Try ${pick(meals)} for lunch today. Stay hydrated and carry local currency for smaller vendors.`,
    };
  });
};

const buildFallbackBudget = (
  numberOfDays: number,
  budgetType: BudgetType,
  hotels: Hotel[]
): BudgetBreakdown => {
  const multiplier = BUDGET_MULTIPLIER[budgetType];
  const avgHotelPrice =
    hotels.reduce((sum, h) => sum + (h.pricePerNight ?? 100), 0) / (hotels.length || 1);

  const accommodation = Math.round(avgHotelPrice * numberOfDays);
  const food = Math.round(40 * multiplier * numberOfDays);
  const transportation = Math.round(30 * multiplier * numberOfDays);
  const activities = Math.round(50 * multiplier * numberOfDays);

  return {
    accommodation,
    food,
    transportation,
    activities,
    total: accommodation + food + transportation + activities,
    currency: 'USD',
  };
};

// ─── Public API ───────────────────────────────────────────────────────────────
// The controller calls this single function. It tries Gemini first and falls
// back to the rule-based generator if the API call fails for any reason.

export type GenerationSource = 'gemini' | 'fallback';

export interface GeneratedTripData {
  itinerary: DayPlan[];
  hotels: Hotel[];
  budget: BudgetBreakdown;
  packingChecklist: string[];
  /** Tells you exactly where the data came from */
  generatedBy: GenerationSource;
  /** Gemini model name, or 'rule-based-engine' for fallback */
  generationModel: string;
}

export const generateTripPlan = async (
  destination: string,
  numberOfDays: number,
  budgetType: BudgetType,
  interests: string[]
): Promise<GeneratedTripData> => {
  // ── Try Gemini first ──
  if (env.GEMINI_API_KEY) {
    try {
      console.log(`🤖 Calling Gemini for: ${destination} (${numberOfDays} days, ${budgetType})`);
      const geminiData = await callGemini(destination, numberOfDays, budgetType, interests);

      // Map Gemini response → our internal types
      const itinerary: DayPlan[] = geminiData.itinerary.map((d) => ({
        day: d.day,
        title: d.title,
        morning: d.morning ?? [],
        afternoon: d.afternoon ?? [],
        evening: d.evening ?? [],
        tips: d.tips ?? '',
      }));

      const hotels: Hotel[] = (geminiData.hotels ?? []).map((h) => ({
        name: h.name,
        rating: Math.min(5, Math.max(1, Math.round(h.rating))),
        description: h.description,
      }));

      const budget: BudgetBreakdown = {
        accommodation: geminiData.budget.accommodation,
        food: geminiData.budget.food,
        transportation: geminiData.budget.transportation,
        activities: geminiData.budget.activities,
        total: geminiData.budget.total,
        currency: geminiData.budget.currency ?? 'USD',
      };

      const packingChecklist: string[] =
        geminiData.packingChecklist?.length > 0
          ? geminiData.packingChecklist
          : PACKING_CHECKLIST_BASE;

      console.log(`✅ [Gemini] Trip generated for "${destination}" — model: gemini-1.5-flash`);
      return {
        itinerary,
        hotels,
        budget,
        packingChecklist,
        generatedBy: 'gemini' as GenerationSource,
        generationModel: 'gemini-2.5-flash',
      };
    } catch (geminiError: unknown) {
      // ─── Print FULL error so you can diagnose exactly what went wrong ───────
      const err = geminiError as Error & { status?: number; statusText?: string; errorDetails?: unknown };
      console.error('─────────────────────────────────────────────');
      console.error('❌ GEMINI API ERROR — falling back to rule-based engine');
      console.error('   Message   :', err.message ?? 'Unknown error');
      console.error('   Status    :', err.status ?? 'N/A');
      console.error('   StatusText:', err.statusText ?? 'N/A');
      console.error('   Details   :', JSON.stringify(err.errorDetails ?? {}, null, 2));
      console.error('   Stack     :', err.stack?.split('\n')[1] ?? 'N/A');
      console.error('─────────────────────────────────────────────');
    }
  } else {
    console.log('ℹ️  No Gemini API key configured, using rule-based generation.');
  }

  // ── Fallback: rule-based generator ──
  console.log(`📋 [Fallback] Rule-based engine generating trip for "${destination}"`);
  const hotels = FALLBACK_HOTELS[budgetType];
  const itinerary = buildFallbackItinerary(destination, numberOfDays, budgetType, interests);
  const budget = buildFallbackBudget(numberOfDays, budgetType, hotels);

  return {
    itinerary,
    hotels,
    budget,
    packingChecklist: PACKING_CHECKLIST_BASE,
    generatedBy: 'fallback' as GenerationSource,
    generationModel: 'rule-based-engine',
  };
};

// ─── Regenerate a Single Day ──────────────────────────────────────────────────

export const regenerateSingleDay = async (
  destination: string,
  dayNumber: number,
  budgetType: BudgetType,
  interests: string[]
): Promise<DayPlan> => {
  // ── Try Gemini for single day ──
  if (env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json', temperature: 0.9 },
      });

      const prompt = `
You are an expert AI Travel Planner.
Generate ONE fresh day itinerary for day ${dayNumber} of a trip to ${destination}.
Budget: ${budgetType}. Interests: ${interests.join(', ')}.
Make it different from a typical day — add variety and surprise.

Return ONLY valid JSON for a single day object:
{
  "day": ${dayNumber},
  "title": "string",
  "morning": ["activity 1", "activity 2"],
  "afternoon": ["activity 3", "activity 4"],
  "evening": ["activity 5"],
  "tips": "short practical tip"
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(text) as DayPlan;
      console.log(`✅ Gemini regenerated day ${dayNumber} for ${destination}`);
      return { ...parsed, day: dayNumber };
    } catch (err) {
      console.warn('⚠️  Gemini day regeneration failed, using fallback:', (err as Error).message);
    }
  }

  // ── Fallback ──
  const themes = DAY_THEMES;
  // Offset by +3 from original to ensure variety
  const themeIndex = (dayNumber - 1 + 3) % themes.length;
  const primary = interests[(dayNumber + 2) % interests.length]?.toLowerCase() ?? 'nature';
  const secondary = interests[(dayNumber + 3) % interests.length]?.toLowerCase() ?? 'relaxation';
  const pActs = FALLBACK_ACTIVITIES[primary] ?? FALLBACK_ACTIVITIES['culture']!;
  const sActs = FALLBACK_ACTIVITIES[secondary] ?? FALLBACK_ACTIVITIES['food']!;
  const meals = FALLBACK_MEALS[budgetType];

  return {
    day: dayNumber,
    title: `${destination} — Day ${dayNumber} Refresh: ${themes[themeIndex]}`,
    morning: pActs.morning.slice(0, 2),
    afternoon: sActs.afternoon.slice(0, 2),
    evening: sActs.evening.slice(0, 1),
    tips: `Regenerated plan! Try ${pick(meals)} for lunch. Carry water and wear comfortable shoes.`,
  };
};
