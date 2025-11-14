import { NextRequest, NextResponse } from "next/server";
import FoodTypeService from "@/server/services/FoodTypeService";
import { FoodTypeController } from "@/server/controllers/FoodTypeController";

/**
 * @route   POST /api/foodtype
 * @desc    Create a new foodtype
 * @access  Authenticated (replace static user later)
 */

// ✅ POST /api/foodtype
export async function POST(req: NextRequest) {
    return await FoodTypeController.createFoodType(req);
}

/**
 * @route   GET /api/foodtypes
 * @desc    Get all foodtypes
 * @access  Public
 */
export async function GET() {
    return await FoodTypeController.getAllFoodTypes();
}