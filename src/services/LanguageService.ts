import prisma from "@/prisma/client";

class LanguageService {
    /**
     * Create a new language
     */
    static async createLanguage(
        data: { name: string; isoCode: string; description?: string },
        creatorId: number
    ) {
        // ✅ Check if language name or isoCode already exists (unique)
        const existing = await prisma.m_language.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { isoCode: data.isoCode },
                ],
                delFlag: false,
            },
        });

        if (existing) {
            throw new Error("Language name or ISO code must be unique");
        }

        // ✅ Create new language
        return prisma.m_language.create({
            data: {
                name: data.name,
                isoCode: data.isoCode,
                description: data.description || null,
                createdBy: creatorId,
                updatedBy: creatorId,
            },
            select: {
                id: true,
                name: true,
                isoCode: true,
                description: true,
            },
        });
    }


    /**
     * Get all languages
     */
    static async getAllLanguages() {
        return prisma.m_language.findMany({
            where: { delFlag: false },
            select: {
                id: true,
                name: true,
                isoCode: true,
                description: true,
            },
            orderBy: { id: "asc" },
        });
    }

    /**
     * Get a language by ID
     */
    static async getLanguageById(id: number) {
        const language = await prisma.m_language.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                isoCode: true,
                description: true,
                delFlag: true,
            },
        });

        if (!language || language.delFlag) return null;

        return {
            id: language.id,
            name: language.name,
            isoCode: language.isoCode,
            description: language.description,
        };
    }
}


export default LanguageService;


