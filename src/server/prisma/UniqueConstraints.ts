export interface CategoryUniqueConstraints {
    name: string;
}

export interface CuisineUniqueConstraints {
    name: string;
}

export interface FoodTypeUniqueConstraints {
    name: string;
}

export interface LanguageUniqueConstraints {
    name: string;
    isoCode: string;
}

export interface RecipeUniqueConstraints {
    uuid: string;
    regionalName: string;
}