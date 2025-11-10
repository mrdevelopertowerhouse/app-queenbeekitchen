import { NextRequest, NextResponse } from "next/server";
import CuisineService from "@/server/services/CuisineService";

// ✅ Unified success response
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

// ✅ Unified error response
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
 * @route   POST /api/cuisines
 * @desc    Create a new cuisine
 * @access  Authenticated (replace static user later)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.name) {
            return NextResponse.json(
                errorResponse({
                    error: new Error("Name is required"),
                    message: "Validation failed",
                }),
                { status: 400 }
            );
        }

        const creatorId = 1; // TODO: replace with real user session later

        const cuisine = await CuisineService.createCuisine(body, creatorId);

        // ✅ Return only selected fields
        const responseData = {
            id: cuisine.id,
            name: cuisine.name,
            description: cuisine.description,
        };

        return NextResponse.json(
            jsonResponse({
                message: "Cuisine created successfully",
                data: responseData,
            }),
            { status: 201 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({
                error,
                message: "Failed to create cuisine",
            }),
            { status: 500 }
        );
    }
}

/**
 * @route   GET /api/cuisines
 * @desc    Get all cuisines
 * @access  Public
 */
export async function GET() {
    try {
        const cuisines = await CuisineService.getAllCuisines();

        return NextResponse.json(
            jsonResponse({
                message: "Cuisines fetched successfully",
                data: cuisines,
            }),
            { status: 200 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({
                error,
                message: "Failed to fetch cuisines",
            }),
            { status: 500 }
        );
    }
}
