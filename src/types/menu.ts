export type Language = "ar" | "en";

export type BranchId = "maqsed" | "bustan";

export type CategoryId =
  | "talbinah"
  | "sweets"
  | "boxes"
  | "ready"
  | "drinks";

export interface Branch {
  id: BranchId;
  nameAr: string;
  nameEn: string;
}

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: Exclude<CategoryId, "drinks">;
  image: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  imageScale?: number;
  branches: BranchId[];
}

export interface Extra {
  id: string;
  nameAr: string;
  nameEn: string;
  quantityAr?: string;
  quantityEn?: string;
  price: number;
  branches: BranchId[];
}

export interface AppState {
  language: Language;
  branch: BranchId;
}
