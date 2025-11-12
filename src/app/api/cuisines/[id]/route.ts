import { NextRequest, NextResponse } from "next/server";
import CuisineService from "@/server/services/CuisineService";
import CuisineController from "@/server/controllers/CuisineController";


/**
 * ✅ GET /api/cuisines/:id
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await CuisineController.getCuisineById(id);
}


/**
 * ✅ PUT /api/cuisines/:id
 */
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await CuisineController.updateCuisine(req, id);
}


/**
 * ✅ PATCH /api/cuisines/:id
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    return await CuisineController.softDeleteCuisine(req, id);
}




