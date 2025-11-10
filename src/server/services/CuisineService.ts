import prisma from "@/prisma/client";
import { CuisineCreateDTO } from "@/shared/dto/cuisine.dto";
import { m_cuisine } from "@prisma/client";

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
            throw error; // Re-throw to handle in controller
        }
    }


    // static async createCuisine(data: { name: string; description?: string }, creatorId: number) {
    //     return prisma.m_cuisine.create({
    //         data: {
    //             name: data.name,
    //             description: data.description || null,
    //             createdBy: creatorId,
    //             updatedBy: creatorId,
    //         },
    //     });
    // }

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
            where: { id },
            select: { id: true, name: true, description: true, delFlag: true },
        });

        if (!cuisine || cuisine.delFlag) return null;

        return {
            id: cuisine.id,
            name: cuisine.name,
            description: cuisine.description,
        };
    }


    static async updateCuisine(id: number, data: any, updaterId: number) {
        return prisma.m_cuisine.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                updatedBy: updaterId,
            },
            select: { id: true, name: true, description: true },
        });
    }


    static async softDeleteCuisine(id: number, delFlag: boolean, updaterId: number) {
        // Check first if the record exists and is not already deleted
        const cuisine = await prisma.m_cuisine.findUnique({
            where: { id },
            select: { id: true, delFlag: true },
        });

        if (!cuisine) {
            throw new Error("Cuisine not found");
        }

        if (cuisine.delFlag && delFlag) {
            throw new Error("Cuisine already deleted");
        }

        return prisma.m_cuisine.update({
            where: { id },
            data: {
                delFlag,
                updatedBy: updaterId,
            },
        });
    }

}

export default CuisineService;
