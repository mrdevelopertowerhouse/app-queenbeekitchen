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



    static async updateCuisine(id: number, data: CuisineUpdateDTO, updaterId: number) {
        try {
            const existingCuisine = await prisma.m_cuisine.findUnique({
                where: { id },
            });

            if (!existingCuisine) {
                throw new NotFoundError("CUISINE_NOT_FOUND");
            }

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

            return updatedCuisine; // ✅ return so controller can use it
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
            throw new NotFoundError(ErrorCode.CUISINE_NOT_FOUND); // ✅ Throw error explicitly
        }

        return cuisine;
    }
}

export default CuisineService;
