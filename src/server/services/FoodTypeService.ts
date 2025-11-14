import prisma from "@/prisma/client";
import { FoodTypeCreateDTO, FoodTypeUpdateDTO } from "@/shared/dto/foodtype.dto";
import { m_food_type, Prisma } from "@prisma/client";
import { AppPrismaError } from "../errors/AppPrismaError";
import { NotFoundError } from "../errors/NotFoundError";
import { FoodTypeUniqueConstraints } from "../prisma/UniqueConstraints";

enum ErrorCode {
    FOODTYPE_NOT_FOUND = "FOODTYPE_NOT_FOUND"
}

class FoodTypeService {

    /**
     * 
     * Create a new foodtype 
     * 
     * - Handles unique constraint violations for foodtype name  
     * 
     * @param data CreateFoodTypeDTO containing foodtype details
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations 
     * @returns Partial<m_food_type> - an object object with only selected fields
     * 
     * @throws HttpError - to be handled by the caller (controller/middleware) for proper HTTP response mapping
     */
    static async createFoodType(data: FoodTypeCreateDTO, creatorId: number): Promise<Partial<m_food_type>> {
        try {
            const savedFoodType = await prisma.m_food_type.create({
                data: {
                    name: data.name,
                    description: data.description,
                    createdBy: creatorId,
                    updatedBy: creatorId
                },
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            });
            return savedFoodType;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_food_type, FoodTypeUniqueConstraints>(error, {
                    fk: ['createdBy', 'updatedBy'],
                    unique: [
                        {
                            field: 'name',
                            message: `Foodtype with name '${data.name}' already exists.`,
                        },
                    ],
                });
            }
            throw error; // Re-throw to handle in controller
        }
    }


    /**
     * 
     * Get all foodtypes that are not soft-deleted
     * 
     * @returns Promise<Partial<m_food_type>[]> - array of foodtype objects with only selected fields
     */

    static async getAllFoodTypes(): Promise<Partial<m_food_type>[]> {
        const foodTypes = await prisma.m_food_type.findMany({
            where: {
                delFlag: false,
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
            orderBy: {
                id: "asc",
            },
        });

        return foodTypes;
    }

    /**
     * 
     * Get a foodtype by its ID
     * @param id FoodType ID 
     * @returns  Promise<Partial<m_food_type>> - foodtype object with only selected fields
     * 
     * @throws NotFoundError if foodtype with given ID does not exist
     */
    static async getFoodTypeById(id: number) {

        const foodType = await prisma.m_food_type.findUnique({
            where: { id, delFlag: false },
            select: { id: true, name: true, description: true, delFlag: true },
        });

        // Guard: if foodtype not found, throw error
        if (!foodType) throw new NotFoundError(ErrorCode.FOODTYPE_NOT_FOUND);

        return {
            id: foodType.id,
            name: foodType.name,
            description: foodType.description,
        };
    }


    /**
     * 
     * Update a foodtype by its ID
     * 
     * @param id Foodtype ID
     * @param data  FoodTYPEUpdateDTO containing updated foodtype details
     * @param updaterId  ID of the user performing the update
     * @returns  Promise<Partial<m_food_type>> - updated foodtype object with only selected fields
     * 
     * @throws NotFoundError if foodtype with given ID does not exist
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations
     */
    static async updateFoodType(id: number, data: FoodTypeUpdateDTO, updaterId: number) {
        try {

            const updateFoodType = await prisma.m_food_type.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description?.trim() || null,
                    updatedBy: updaterId,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            });

            if (!updateFoodType) {
                throw new NotFoundError("FOODTYPE_NOT_FOUND");
            }

            return updateFoodType;

        } catch (error) {
            console.error("❌ Error while updating foodtype", error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_food_type, FoodTypeUniqueConstraints>(error, {
                    fk: ['updatedBy'],
                    unique: [
                        {
                            field: "name",
                            message: `Foodtype with name '${data.name}' already exists.`,
                        },
                    ],
                    notFound: { errorCode: ErrorCode.FOODTYPE_NOT_FOUND }

                });
            }

            throw error;
        }
    }


    /**
     * 
     * Soft delete a foodtype by setting its delFlag
     * 
     * @param id Foodtype ID
     * @param delFlag   Boolean flag to indicate soft deletion
     * @param updaterId  ID of the user performing the deletion
     * @returns  Promise<m_food_type> - the soft-deleted foodtype object
     * 
     * @throws NotFoundError if foodtype with given ID does not exist
     */
    static async softDeleteFoodType(id: number, delFlag: boolean, updaterId: number) {

        try {
            const foodType = await prisma.m_food_type.update({
                where: { id },
                data: {
                    delFlag,
                    updatedBy: updaterId,
                },
            });

            return foodType;
        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_food_type, FoodTypeUniqueConstraints>(error, {
                    fk: ['updatedBy'],
                    notFound: { errorCode: ErrorCode.FOODTYPE_NOT_FOUND }

                });
            }

            throw error;
        }
    }
}

export default FoodTypeService;
