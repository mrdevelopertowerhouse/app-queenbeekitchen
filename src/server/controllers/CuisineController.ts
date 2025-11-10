import { NextRequest, NextResponse } from "next/server";
import CuisineService from "@/server/services/CuisineService";
import { RequestValidator } from "../validators/cuisine.validator";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";

class CuisineController {


    static async createCuisine(req: NextRequest) {
        try {
            // ✅ Parse the request body first
            const body = await req.json();

            // ✅ Validate the body after parsing
            RequestValidator.createCuisine(body);

            // TODO: replace with real user session later
            const creatorId = 1;

            const cuisine = await CuisineService.createCuisine(body, creatorId);

            // ✅ Return only selected fields
            const responseData = {
                id: cuisine.id,
                name: cuisine.name,
                description: cuisine.description,
            };

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: responseData ? 1 : 0,
                    message: responseData ? "Cuisine created successfully" : "Failed to create cuisine",
                    data: responseData,
                }),
                { status: 201 }
            );

        } catch (error: unknown) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(
                Controller.errorResponse({
                    error: error,
                    message: "Failed to create cuisine",
                }),
                { status: 500 }
            );

            //     return NextResponse.json(Controller.errorResponse(      

            //         {
            //             error:error,
            //             message: "Failed to create cuisine",
            //         },
            //         { status: 500 }
            //    );
        }
    }



    static async getAllCuisines() {
        try {
            const cuisines = await CuisineService.getAllCuisines();
            return NextResponse.json(
                {
                    message: "Cuisines retrieved successfully",
                    data: cuisines,
                },
                { status: 200 }
            );
        } catch (error: unknown) {
            console.error("Get all cuisines error:", error);
            return NextResponse.json(
                {
                    message: "Failed to fetch cuisines",
                    error: (error as Error).message ?? String(error),
                },
                { status: 500 }
            );
        }

    }
}