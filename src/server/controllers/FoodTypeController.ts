import { NextRequest, NextResponse } from "next/server";
import { FoodTypeRequestValidator } from "../validators/foodtype.validator";
import FoodTypeService from "../services/FoodTypeService";
import { Controller } from "./Controller";
import { HttpError } from "../errors/httpError";
import { RequestValidator } from "../validators/validators";
import { FoodTypeUpdateDTO } from "@/shared/dto/foodtype.dto";
import { SoftDeleteUpdateDTO } from "@/shared/dto/common.dto";

export class FoodTypeController {

    static async createFoodType(req: NextRequest) {
        try {
            // ✅ Parse the request body first
            const body = await req.json();

            // ✅ Validate the body after parsing
            FoodTypeRequestValidator.createFoodType(body);

            const foodType = await FoodTypeService.createFoodType(body, 1);

            // ✅ Return only selected fields
            const responseData = {
                id: foodType.id,
                name: foodType.name,
                description: foodType.description,
            };

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: responseData ? 1 : 0,
                    message: responseData ? "Foodtype created successfully" : "Failed to create foodtype",
                    data: responseData,
                }),
                { status: 201 }
            );

        } catch (error: unknown) {
            console.error("🔥 Controller error in createFoodtype:", error);

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(
                Controller.errorResponse({
                    error: error,
                    message: "Failed to create foodtype",
                }),
                { status: 500 }
            );
        }
    }


    static async getAllFoodTypes() {
        try {
            const foodTypes = await FoodTypeService.getAllFoodTypes();

            return NextResponse.json(
                Controller.jsonResponse({
                    statusCode: foodTypes && foodTypes.length > 0 ? 1 : 0,
                    message: foodTypes && foodTypes.length > 0 ? "Foodtypes fetched successfully" : "No foodtypes found",
                    data: foodTypes,
                }),
                { status: 200 }
            );
        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Failed to fetch foodtypes",
            })), { status: 500 };
        }
    }


    static async getFoodTypeById(id: string) {

        try {

            const foodTypeId = RequestValidator.validateNumericParam(id)

            const foodType = await FoodTypeService.getFoodTypeById(foodTypeId);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: foodType ? 1 : 0,
                message: foodType ? "Foodtype fetched successfully" : "Foodtype not found",
                data: foodType,
            }), { status: 200 })

        } catch (error) {
            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Foodtype not fetched",
            }), { status: 500 });
        }
    }


    static async updateFoodType(req: NextRequest, id: string) {

        try {

            // Validate the 
            const foodTypeId = RequestValidator.validateNumericParam(id)

            // parse the request body to get delFlag
            const body = await req.json() as FoodTypeUpdateDTO;

            FoodTypeRequestValidator.updateFoodType(body);

            const foodType = await FoodTypeService.getFoodTypeById(Number(id));

            return NextResponse.json(Controller.jsonResponse({
                statusCode: foodType ? 1 : 0,
                message: "Foodtype updated successfully",
                data: foodType
            }), { status: 200 });

        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Foodtype not updated",
            }), { status: 500 });

        }
    }


    static async softDeleteFoodType(req: NextRequest, id: string) {

        try {

            const foodTypeId = RequestValidator.validateNumericParam(id);

            // parse the request body to get delFlag
            const body = await req.json() as SoftDeleteUpdateDTO;

            RequestValidator.validateSoftDelete(body);

            const deleted = await FoodTypeService.softDeleteFoodType(foodTypeId, body.delFlag, 1);

            return NextResponse.json(Controller.jsonResponse({
                statusCode: deleted ? 1 : 0,
                message: deleted ? "Foodtype deleted successfully" : "Foodtype not found",
            }), { status: 200 });

        } catch (error) {

            if (error instanceof HttpError) {
                return NextResponse.json(error.toJson(), { status: error.status });
            }

            return NextResponse.json(Controller.errorResponse({
                error: error,
                message: "Foodtype not deleted",
            }), { status: 500 });
        }
    }
}