import { NextRequest, NextResponse } from "next/server";
import CuisineService from "@/server/services/CuisineService";
import CuisineController from "@/server/controllers/CuisineController";


/**
 * @route   POST /api/cuisines
 * @desc    Create a new cuisine
 * @access  Authenticated (replace static user later)
 */

// ✅ POST /api/cuisines
export async function POST(req: NextRequest) {
    return await CuisineController.createCuisine(req);
}


/**
 * @route   GET /api/cuisines
 * @desc    Get all cuisines
 * @access  Public
 */
export async function GET() {
    return await CuisineController.getAllCuisines();
}

