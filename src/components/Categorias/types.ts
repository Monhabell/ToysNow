export interface Subcategory {
    id: number;
    name: string;
    slug: string;

}

export interface Category {
    id: number;
    name: string;
    subcategory_id: Subcategory[];
    img: string;
    slug: string;
}

// Tipo para la respuesta de la API
export interface ApiResponse {
    data: Category[];
    success: boolean;
    message?: string;
}