import prisma, { Prisma } from "@/prisma/client";
// import prisma from "@/prisma/client";
import { CuisineCreateDTO, CuisineUpdateDTO } from "@/shared/dto/cuisine.dto";
import { m_cuisine } from "@prisma/client";
import App from "next/app";
import { AppPrismaError } from "../errors/AppPrismaError";
import { CuisineUniqueConstraints } from "@/shared/types/CuisineUniqueConstraints";
import { NotFoundError } from "../errors/NotFoundError";


enum ErrorCode {
    CUISINE_NOT_FOUND = "CUISINE_NOT_FOUND"
}

class CuisineService {
    static getInstance() {
        throw new Error("Method not implemented.");
    }

    static async createCuisine(data: CuisineCreateDTO, creatorId: number): Promise<Partial<m_cuisine>> {
        try {
            const savedCuisine = await prisma.m_cuisine.create({
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
            return savedCuisine;
        } catch (error) {
            console.error("❌ Error while creating cuisine:", error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_cuisine, CuisineUniqueConstraints>(error, {
                    unique: [
                        {
                            field: 'name',
                            message: `Cuisine with name '${data.name}' already exists.`,
                        },
                    ],
                });
            }
            throw error; // Re-throw to handle in controller
        }
    }


    static async getAllCuisines(): Promise<Partial<m_cuisine>[]> {
        const cuisines = await prisma.m_cuisine.findMany({
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

        return cuisines;
    }


    static async getCuisineById(id: number) {

        const cuisine = await prisma.m_cuisine.findUnique({
            where: { id, delFlag: false },
            select: { id: true, name: true, description: true, delFlag: true },
        });

        // Guard: if cuisine not found, throw error
        if (!cuisine) throw new NotFoundError(ErrorCode.CUISINE_NOT_FOUND);

        return {
            id: cuisine.id,
            name: cuisine.name,
            description: cuisine.description,
        };
    }


    //  export const updateVehicle = async (req: Request, res: Response) => {

    //   try {

    //     /** Validate Role */
    //     Controller.validateRole(req, ['super-admin', 'admin', 'manager']);

    //     /* Request body validation */
    //     RequestValidator.updateVehicle(req.body);

    //     // Update vehicle
    //     const { id } = req.params;
    //     const updated = await vehicleService.updateVehicle(Number(id), req.body);

    //     // If update is successful, return the response
    //     res.status(200).json(Controller.jsonResponse({
    //       statusCode: updated ? 1 : 0,
    //       message: updated ? "Vehicle updated successfully" : "Vehicle not found",
    //       data: updated
    //     }));

    //   } catch (error) {
    //     //  console.error("UserController:", error);

    //     // Handle HttpError specifically
    //     if (error instanceof HttpError)
    //       return res.status(error.status).json(error.toJson());

    //     // Handle other errors
    //     res.status(500).json(Controller.errorResponse({
    //       error: error,
    //       message: "Failed to update vehicle"
    //     }));
    //   }
    // }

    static async updateCuisine(id: number, data: CuisineUpdateDTO, updaterId: number) {
        try {

            const updatedCuisine = await prisma.m_cuisine.update({
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

            if (!updatedCuisine) {
                throw new NotFoundError("CUISINE_NOT_FOUND");
            }

            return updatedCuisine;

        } catch (error) {
            console.error("❌ Error while updating cuisine:", error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_cuisine, CuisineUniqueConstraints>(error, {
                    unique: [
                        {
                            field: "name",
                            message: `Cuisine with name '${data.name}' already exists.`,
                        },
                    ],
                });
            }

            throw error;
        }
    }


    static async softDeleteCuisine(id: number, delFlag: boolean, updaterId: number) {

        const cuisine = await prisma.m_cuisine.update({
            where: { id },
            data: {
                delFlag,
                updatedBy: updaterId,
            },
        });

        // Guard: if cuisine not found, throw error
        if (!cuisine) {
            throw new NotFoundError(ErrorCode.CUISINE_NOT_FOUND);
        }

        return cuisine;
    }
}

export default CuisineService;
