import { NextRequest, NextResponse } from "next/server";
import LanguageService from "@/server/services/LanguageService";

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
 * @route   POST /api/languages
 * @desc    Create a new language
 * @access  Authenticated (replace static user later)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, isoCode, description } = body;

        // ✅ Validations
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

        const creatorId = 1; // TODO: replace with actual logged-in user ID

        const language = await LanguageService.createLanguage(
            { name, isoCode, description },
            creatorId
        );

        const responseData = {
            id: language.id,
            name: language.name,
            isoCode: language.isoCode,
            description: language.description,
        };

        return NextResponse.json(
            jsonResponse({
                message: "Language created successfully",
                data: responseData,
            }),
            { status: 201 }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            errorResponse({
                error,
                message: "Failed to create language",
            }),
            { status: 500 }
        );
    }
}


/**
 * @route   GET /api/languages
 * @desc    Get all active languages
 */
export async function GET() {
    try {
        const languages = await LanguageService.getAllLanguages();

        return NextResponse.json(
            jsonResponse({
                message: "Languages fetched successfully",
                data: languages,
            }),
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse({ error, message: "Failed to fetch languages" }),
            { status: 500 }
        );
    }
}




