import prisma, { Prisma } from "@/prisma/client";
import { LanguageCreateDTO, LanguageUpdateDTO } from "@/shared/dto/language.dto";
import { AppPrismaError } from "../errors/AppPrismaError";
import { m_language } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";
import { LanguageUniqueConstraints } from "../prisma/UniqueConstraints";


enum ErrorCode {
    LANGUAGE_NOT_FOUND = "LANGUAGE_NOT_FOUND"
}

class LanguageService {
    /**
     * 
     * Create a new language 
     * 
     * - Handles unique constraint violations for language name  
     * 
     * @param data CreateLanguageDTO containing cuisine details
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations 
     * @returns Partial<m_language> - an object object with only selected fields
     * 
     * @throws HttpError - to be handled by the caller (controller/middleware) for proper HTTP response mapping
     */
    static async createLanguage(data: LanguageCreateDTO, creatorId: number): Promise<Partial<m_language>> {
        try {
            const savedLanguage = await prisma.m_language.create({
                data: {
                    name: data.name,
                    isoCode: data.isoCode,
                    createdBy: creatorId,
                    updatedBy: creatorId
                },
                select: {
                    id: true,
                    name: true,
                    isoCode: true,
                }
            });
            return savedLanguage;

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_language, LanguageUniqueConstraints>(error, {
                    fk: ['createdBy', 'updatedBy'],
                    unique: [
                        {
                            field: 'name',
                            message: `Language with name '${data.name}' already exists.`,
                        },
                        {
                            field: "isoCode",
                            message: `Language with ISO code '${data.isoCode}' already exists.`,
                        },
                    ],
                });
            }
            throw error; // Re-throw to handle in controller
        }
    }


    /**
     * 
     * Get all languages that are not soft-deleted
     * 
     * @returns Promise<Partial<m_language>[]> - array of languages objects with only selected fields
     */

    static async getAllLanguages(): Promise<Partial<m_language>[]> {
        const languages = await prisma.m_language.findMany({
            where: {
                delFlag: false,
            },
            select: {
                id: true,
                name: true,
                isoCode: true,
            },
            orderBy: {
                id: "asc",
            },
        });

        return languages;
    }

    /**
    * 
    * Get a language by its ID
    * @param id Language ID 
    * @returns  Promise<Partial<m_language>> - language object with only selected fields
    * 
    * @throws NotFoundError if language with given ID does not exist
    */
    static async getLanguageById(id: number) {

        const language = await prisma.m_language.findUnique({
            where: { id, delFlag: false },
            select: {
                id: true,
                name: true,
                isoCode: true,
            }
        });
        // Guard: if language not found, throw error
        if (!language) throw new NotFoundError(ErrorCode.LANGUAGE_NOT_FOUND);

        return {
            id: language.id,
            name: language.name,
            isoCode: language.isoCode,
        };
    }

    /**
     * 
     * Update a language by its ID
     * 
     * @param id Language ID
     * @param data  LanguageUpdateDTO containing updated language details
     * @param updaterId  ID of the user performing the update
     * @returns  Promise<Partial<m_language>> - updated language object with only selected fields
     * 
     * @throws NotFoundError if language with given ID does not exist
     * @throws Prisma.PrismaClientKnownRequestError for unique constraint violations
     */
    static async updateLanguage(id: number, data: LanguageUpdateDTO, updaterId: number) {
        try {
            const updateLanguage = await prisma.m_language.update({
                where: { id },
                data: {
                    name: data.name,
                    isoCode: data.isoCode,
                    updatedBy: updaterId,
                },
                select: {
                    id: true,
                    name: true,
                    isoCode: true,
                },
            });
            if (!updateLanguage) {
                throw new NotFoundError(ErrorCode.LANGUAGE_NOT_FOUND);
            }
            return updateLanguage;

        } catch (error) {
            console.error("❌ Error while updating language:", error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_language, LanguageUniqueConstraints>(error, {
                    fk: ['updatedBy'],
                    unique: [
                        {
                            field: 'name',
                            message: `Language with name '${data.name}' already exists.`,
                        },
                        {
                            field: "isoCode",
                            message: `Language with ISO code '${data.isoCode}' already exists.`,
                        },
                    ],
                    notFound: { errorCode: ErrorCode.LANGUAGE_NOT_FOUND }
                });
            }
            throw error;
        }
    }

    /**
     * 
     * Soft delete a language by setting its delFlag 
     * @param id Language ID
     * @param delFlag   Boolean flag to indicate soft deletion
     * @param updaterId  ID of the user performing the deletion
     * @returns  Promise<m_language> - the soft-deleted language object
     * 
     * @throws NotFoundError if language with given ID does not exist
     */
    static async softDeleteLanguage(id: number, delFlag: boolean, updaterId: number) {

        try {
            const language = await prisma.m_language.update({
                where: { id },
                data: {
                    delFlag,
                    updatedBy: updaterId,
                },
            });
            return language;

        } catch (error) {


            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                AppPrismaError.handle<m_language, LanguageUniqueConstraints>(error, {
                    fk: ['updatedBy'],
                    notFound: { errorCode: ErrorCode.LANGUAGE_NOT_FOUND }
                });
            }
            throw error;


        }
    }
}


export default LanguageService;


