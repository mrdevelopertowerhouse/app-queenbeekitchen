import { NextRequest, NextResponse } from "next/server";
import LanguageService from "@/server/services/LanguageService";

function jsonResponse({
    statusCode = 1,
    message = "",
    data = null,
}: {
    statusCode?: number;
    message?: string;
    data?: any;
}) {
    return { statusCode, message, data };
}

function errorResponse({
    error,
    message = "Something went wrong",
}: {
    error: unknown;
    message?: string;
}) {
    console.error("❌ Error:", error);
    const err = error as Error;
    return { statusCode: 0, message, error: err.message || String(error) };
}

/**
 * ✅ GET /api/languages/:id
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // 👈 params is now a Promise
) {
    try {
        const { id: idParam } = await context.params; // 👈 await it properly
        const id = Number(idParam);

        if (!idParam || isNaN(id)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const language = await LanguageService.getLanguageById(id);
        if (!language) {
            return NextResponse.json(
                { statusCode: 0, message: "Language not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            jsonResponse({
                message: "Language fetched successfully",
                data: language,
            }),
            { status: 200 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to fetch language" }),
            { status: 500 }
        );
    }
}

/**
 * ✅ PUT /api/languages/:id
 */
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // 👈 same fix here
) {
    try {
        const { id: idParam } = await context.params;
        const id = Number(idParam);

        if (!idParam || isNaN(id)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { name, isoCode, description } = body;

        if (!name) {
            return NextResponse.json(
                errorResponse({
                    error: new Error("Name is required"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        if (!isoCode) {
            return NextResponse.json(
                errorResponse({
                    error: new Error("ISO Code is required"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        const updaterId = 1; // Replace with real user session later
        const updatedLanguage = await LanguageService.updateLanguage(
            id,
            { name, isoCode, description },
            updaterId
        );

        return NextResponse.json(
            jsonResponse({
                message: "Language updated successfully",
                data: updatedLanguage,
            }),
            { status: 200 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to update language" }),
            { status: 500 }
        );
    }
}


/**
 * @route   PATCH /api/languages/:id
 * @desc    Soft delete a specific language by ID (set delFlag = true)
 * @access  Authenticated
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        // ✅ Handle dynamic route params safely
        const { id } = await context.params;
        const languageId = Number(id);

        if (!id || isNaN(languageId)) {
            return NextResponse.json(
                { statusCode: 0, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        // ✅ Validate request body
        const body = await req.json();
        if (typeof body.delFlag !== "boolean") {
            return NextResponse.json(
                errorResponse({
                    error: new Error("delFlag must be a boolean"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        // ✅ Perform soft delete
        const updaterId = 1; // Replace with real user ID later
        await LanguageService.softDeleteLanguage(languageId, body.delFlag, updaterId);

        // ✅ Return 204 No Content on success
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to soft delete language" }),
            { status: 500 }
        );
    }
}

