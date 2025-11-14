export interface RecipeCreateDTO {
    cuisineId: number;
    categoryId: number;
    foodTypeId: number;
    uuid: string;
    title_name: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
}
