export interface FoodTypeCreateDTO {
    name: string;
    description?: string;
}

export interface FoodTypeUpdateDTO {
    name: string;
    description?: string | null;
}
