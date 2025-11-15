import { NextRequest, NextResponse } from "next/server";
import CuisineService from "@/server/services/CuisineService";
import { CuisineRequestValidator } from "../validators/cuisine.validator";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";
import { RequestValidator } from "../validators/validators";
import { SoftDeleteUpdateDTO } from "@/shared/dto/common.dto";
import { CuisineCreateDTO, CuisineUpdateDTO } from "@/shared/dto/cuisine.dto";

export class CuisineController {

    static async createCuisine(req: NextRequest) {
        try {
            // ✅ Parse the request body first
            const body = await req.json() as CuisineCreateDTO;

            // ✅ Validate the body after parsing
            CuisineRequestValidator.createCuisine(body);

            const cuisine = await CuisineService.createCuisine(body, 1);

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
            console.error("🔥 Controller error in createCuisine:", error);

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
                Controller.jsonResponse({
                    statusCode: cuisines && cuisines.length > 0 ? 1 : 0,
                    message: cuisines && cuisines.length > 0 ? "Cuisines fetched successfully" : "No cuisines found",
                    data: cuisines,
                }),
                { status: 200 }
            );
        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Failed to fetch cuisines",
            }), { status: 500 });
        }
    }


    static async getCuisineById(id: string) {
        try {

            const cuisineId = RequestValidator.validateNumericParam(id)

            const cuisine = await CuisineService.getCuisineById(cuisineId);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: cuisine ? 1 : 0,
                message: cuisine ? "Cuisine fetched successfully" : "Cuisine not found",
                data: cuisine,
            }), { status: 200 })

        } catch (error) {
            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Cuisine not fetched",
            }), { status: 500 });
        }
    }


    static async updateCuisine(req: NextRequest, id: string) {

        try {

            const cuisineId = RequestValidator.validateNumericParam(id);

            // parse the request body to get delFlag
            const body = await req.json() as CuisineUpdateDTO;

            // 
            CuisineRequestValidator.updateCuisine(body);

            const cuisine = await CuisineService.updateCuisine(cuisineId, body, 1);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: cuisine ? 1 : 0,
                message: "Cuisine updated successfully",
                data: cuisine,
            }), { status: 200 });


        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Cuisine not updated",
            }), { status: 500 });
        }
    }


    static async softDeleteCuisine(req: NextRequest, id: string) {

        try {

            const cuisineId = RequestValidator.validateNumericParam(id);

            // parse the request body to get delFlag
            const body = await req.json() as SoftDeleteUpdateDTO;

            RequestValidator.validateSoftDelete(body);

            const deleted = await CuisineService.softDeleteCuisine(cuisineId, body.delFlag, 1);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: deleted ? 1 : 0,
                message: deleted ? "Cuisine deleted successfully" : "Cuisine not found",
            }), { status: 200 });

        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Cuisine not deleted",
            }), { status: 500 });
        }
    }
}

export default CuisineController;