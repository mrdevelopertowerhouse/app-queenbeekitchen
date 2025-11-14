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


    /**
     * 
     * Create a new cuisine 
     * 
     * - Handles unique constraint violations for cuisine name  
     * 
     * @param data CreateCuisineDTO containing cuisine details
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations 
     * @returns Partial<m_cuisine> - an object object with only selected fields
     * @throws HttpError - to be handled by the caller (controller/middleware) for proper HTTP response mapping
     */
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

    /**
     * 
     * Get all cuisines that are not soft-deleted
     * 
     * @returns Promise<Partial<m_cuisine>[]> - array of cuisine objects with only selected fields
     */

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

    /**
     * 
     * Get a cuisine by its ID
     * @param id Cuisine ID 
     * @returns  Promise<Partial<m_cuisine>> - cuisine object with only selected fields
     * 
     * @throws NotFoundError if cuisine with given ID does not exist
     */
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


    /**
     * 
     * Update a cuisine by its ID
     * 
     * @param id Cuisine ID
     * @param data  CuisineUpdateDTO containing updated cuisine details
     * @param updaterId  ID of the user performing the update
     * @returns  Promise<Partial<m_cuisine>> - updated cuisine object with only selected fields
     * 
     * @throws NotFoundError if cuisine with given ID does not exist
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations
     */
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
                    whereNotFound: { errorCode: "CUISINE_NOT_FOUND" }
                });
            }

            throw error;
        }
    }

    /**
     * 
     * Soft delete a cuisine by setting its delFlag
     * 
     * @param id Cuisine ID
     * @param delFlag   Boolean flag to indicate soft deletion
     * @param updaterId  ID of the user performing the deletion
     * @returns  Promise<m_cuisine> - the soft-deleted cuisine object
     * 
     * @throws NotFoundError if cuisine with given ID does not exist
     */
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
