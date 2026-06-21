import { Response, NextFunction } from 'express';
import Trip from '../models/Trip';
import { AuthRequest, CreateTripBody, UpdateDayBody } from '../types';
import { generateTripPlan, regenerateSingleDay } from '../services/aiService';

// @desc    Create a new trip with AI-generated itinerary
// @route   POST /api/trips
// @access  Private
export const createTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { destination, numberOfDays, budgetType, interests } =
      req.body as CreateTripBody;

    if (!destination || !numberOfDays || !budgetType || !interests?.length) {
      res.status(400).json({
        success: false,
        message: 'destination, numberOfDays, budgetType, and interests are required',
      });
      return;
    }

    // Call the AI service (Gemini → fallback)
    const { itinerary, hotels, budget, packingChecklist, generatedBy, generationModel } =
      await generateTripPlan(destination, numberOfDays, budgetType, interests);

    const trip = await Trip.create({
      userId: req.user!.id,
      destination,
      numberOfDays,
      budgetType,
      interests,
      itinerary,
      hotels,
      budget,
      packingChecklist,
      generatedBy,
      generationModel,
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      // Surface the source so the frontend / developer can see it immediately
      meta: {
        generatedBy,
        generationModel,
        source: generatedBy === 'gemini'
          ? `🤖 Real AI — powered by ${generationModel}`
          : '📋 Hardcoded fallback — rule-based engine (Gemini unavailable)',
      },
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trips for the authenticated user (lightweight list)
// @route   GET /api/trips
// @access  Private
export const getMyTrips = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt((req.query['page'] as string) ?? '1', 10);
    const limit = parseInt((req.query['limit'] as string) ?? '10', 10);
    const skip = (page - 1) * limit;

    const [trips, total] = await Promise.all([
      Trip.find({ userId: req.user!.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-itinerary -hotels -packingChecklist'), // Omit heavy fields in list view
      Trip.countDocuments({ userId: req.user!.id }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Trips fetched successfully',
      data: trips,
      total,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single trip by ID — strict data isolation enforced
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // userId filter ensures user can ONLY access their own trips
    const trip = await Trip.findOne({
      _id: req.params['id'],
      userId: req.user!.id,
    });

    if (!trip) {
      res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have permission to access it',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Trip fetched successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific day's itinerary (manual edit)
// @route   PUT /api/trips/:id/day/:dayNumber
// @access  Private
export const updateDay = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dayNumber = parseInt(req.params['dayNumber'] ?? '0', 10);
    const { dayPlan } = req.body as UpdateDayBody;

    if (!dayPlan) {
      res.status(400).json({ success: false, message: 'dayPlan is required' });
      return;
    }

    const trip = await Trip.findOne({
      _id: req.params['id'],
      userId: req.user!.id,
    });

    if (!trip) {
      res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have permission to modify it',
      });
      return;
    }

    const dayIndex = trip.itinerary.findIndex((d) => d.day === dayNumber);
    if (dayIndex === -1) {
      res.status(404).json({ success: false, message: `Day ${dayNumber} not found` });
      return;
    }

    trip.itinerary[dayIndex] = { ...dayPlan, day: dayNumber };
    await trip.save();

    res.status(200).json({
      success: true,
      message: `Day ${dayNumber} updated successfully`,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate a specific day using AI
// @route   POST /api/trips/:id/day/:dayNumber/regenerate
// @access  Private
export const regenerateDay = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dayNumber = parseInt(req.params['dayNumber'] ?? '0', 10);

    const trip = await Trip.findOne({
      _id: req.params['id'],
      userId: req.user!.id,
    });

    if (!trip) {
      res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have permission to modify it',
      });
      return;
    }

    const dayIndex = trip.itinerary.findIndex((d) => d.day === dayNumber);
    if (dayIndex === -1) {
      res.status(404).json({ success: false, message: `Day ${dayNumber} not found` });
      return;
    }

    // Call Gemini (with fallback) for a single fresh day
    const newDayPlan = await regenerateSingleDay(
      trip.destination,
      dayNumber,
      trip.budgetType,
      trip.interests
    );

    trip.itinerary[dayIndex] = newDayPlan;
    await trip.save();

    res.status(200).json({
      success: true,
      message: `Day ${dayNumber} regenerated successfully`,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params['id'],
      userId: req.user!.id,
    });

    if (!trip) {
      res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have permission to delete it',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
