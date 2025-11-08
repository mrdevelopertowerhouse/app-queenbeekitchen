import { NextRequest, NextResponse } from "next/server";
import FoodTypeService from "@/services/FoodService";

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
 * @route   POST /api/foodtype
 * @desc    Create a new foodtype
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

        const foodtype = await FoodTypeService.createFoodType(body, creatorId);

        // ✅ Return only selected fields
        const responseData = {
            id: foodtype.id,
            name: foodtype.name,
            description: foodtype.description,
        };

        return NextResponse.json(
            jsonResponse({
                message: "Foodtype created successfully",
                data: responseData,
            }),
            { status: 201 }
        );

    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({
                error,
                message: "Failed to create foodtype",
            }),
            { status: 500 }
        );
    }
}


/**
 * @route   GET /api/foodtype
 * @desc    Get all foodtypes
 * @access  Public
 */
export async function GET() {
    try {
        const foodtypes = await FoodTypeService.getAllFoodTypes();

        return NextResponse.json(
            jsonResponse({
                message: "Foodtypes fetched successfully",
                data: foodtypes,
            }),
            { status: 200 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({
                error,
                message: "Failed to fetch foodtypes",
            }),
            { status: 500 }
        );
    }
}