import type { Extra } from "../types/menu";

const sharedBranches = ["maqsed", "bustan"] as const;

export const extras: Extra[] = [
  {
    id: "saudi-coffee",
    nameAr: "قهوة سعودية",
    nameEn: "Saudi Coffee",
    quantityAr: "كوب",
    quantityEn: "Cup",
    price: 5,
    branches: [...sharedBranches]
  },
  {
    id: "coffee-of-day-hot",
    nameAr: "قهوة اليوم - حارة",
    nameEn: "Coffee of the Day - Hot",
    price: 9,
    branches: ["bustan"]
  },
  {
    id: "coffee-of-day-cold",
    nameAr: "قهوة اليوم - باردة",
    nameEn: "Coffee of the Day - Cold",
    price: 10,
    branches: ["bustan"]
  },
  {
    id: "tea",
    nameAr: "شاي",
    nameEn: "Tea",
    quantityAr: "كوب",
    quantityEn: "Cup",
    price: 5,
    branches: ["bustan"]
  },
  {
    id: "water",
    nameAr: "ماء",
    nameEn: "Water",
    quantityAr: "عبوة",
    quantityEn: "Bottle",
    price: 1,
    branches: [...sharedBranches]
  },
  {
    id: "basbousa",
    nameAr: "بسبوسة",
    nameEn: "Basbousa",
    quantityAr: "قطعة واحدة",
    quantityEn: "One Piece",
    price: 6,
    branches: [...sharedBranches]
  },
  {
    id: "maamoul",
    nameAr: "معمول",
    nameEn: "Maamoul",
    quantityAr: "3 قطع",
    quantityEn: "3 Pieces",
    price: 10,
    branches: [...sharedBranches]
  }
];
