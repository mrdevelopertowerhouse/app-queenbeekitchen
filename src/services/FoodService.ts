import prisma from "@/prisma/client";

class FoodtypeService {
    static async createCuisine(data: { name: string; description?: string }, creatorId: number) {
        return prisma.m_cuisine.create({
            data: {
                name: data.name,
                description: data.description || null,
                createdBy: creatorId,
                updatedBy: creatorId,
            },
        });
    }

}