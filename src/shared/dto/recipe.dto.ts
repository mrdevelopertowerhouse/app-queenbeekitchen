export interface RecipeCreateDTO {
    cuisineId: number;
    categoryId: number;
    foodTypeId: number;
    uuid: string;
    titleName: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
}

export interface RecipeUpdateDTO {
    cuisineId?: number;
    categoryId?: number;
    foodTypeId?: number;
    titleName?: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
}


