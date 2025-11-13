export interface CategoryCreateDTO {
    name: string;
    description?: string;
}

export interface CategoryUpdateDTO {
    name: string;
    description?: string | null;
}
