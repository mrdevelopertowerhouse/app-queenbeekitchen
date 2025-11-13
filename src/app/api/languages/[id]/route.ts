import { NextRequest, NextResponse } from "next/server";
import LanguageService from "@/server/services/LanguageService";
import { LanguageController } from "@/server/controllers/LanguageController";


/**
 * ✅ GET /api/languages/:id
 */
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await LanguageController.getLanguageById(id);
}

/**
 * ✅ PUT /api/languages/:id
 */
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return await LanguageController.updateLanguage(req, id);
}


/**
 * @route   PATCH /api/languages/:id
 * @desc    Soft delete a specific language by ID (set delFlag = true)
 * @access  Authenticated
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    return await LanguageController.softDeleteLanguage(req, id);
}

