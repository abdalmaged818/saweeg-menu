import type { Product } from "../types/menu";

const sharedBranches = ["maqsed", "bustan"] as const;

export const products: Product[] = [
  {
    id: "talbinah-ice-cream",
    nameAr: "آيسكريم تلبينة نبوية",
    nameEn: "Talbinah Ice Cream",
    price: 13,
    category: "talbinah",
    displayMode: "image",
    image: "talbinah-ice-cream.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "cold-talbinah",
    nameAr: "تلبينة باردة",
    nameEn: "Cold Talbinah",
    price: 13,
    category: "talbinah",
    displayMode: "image",
    image: "cold-talbinah.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "hot-talbinah",
    nameAr: "تلبينة حارة",
    nameEn: "Hot Talbinah",
    price: 15,
    category: "talbinah",
    displayMode: "image",
    image: "hot-talbinah.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "talbinah-lotus-cheesecake",
    nameAr: "تشيز كيك تلبينة لوتس",
    nameEn: "Talbinah Lotus Cheesecake",
    price: 16,
    category: "sweets",
    displayMode: "image",
    image: "talbinah-lotus-cheesecake.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "dates-with-sawiq",
    nameAr: "تمر بالسويق",
    nameEn: "Dates with Sawiq",
    price: 16,
    category: "sweets",
    displayMode: "compact",
    branches: [...sharedBranches]
  },
  {
    id: "damkah",
    nameAr: "الدمكة",
    nameEn: "Damkah",
    price: 16,
    category: "sweets",
    displayMode: "image",
    image: "damkah.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "maamoul-box",
    nameAr: "بوكس معمول",
    nameEn: "Maamoul Box",
    price: 78,
    category: "boxes",
    displayMode: "image",
    image: "maamoul-box.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "basbousa-box",
    nameAr: "بوكس بسبوسة",
    nameEn: "Basbousa Box",
    price: 69,
    category: "boxes",
    displayMode: "image",
    image: "basbousa-box.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "talbinah-sachet-box",
    nameAr: "بوكس أظرف التلبينة",
    nameEn: "Talbinah Sachet Box",
    price: 58,
    category: "boxes",
    displayMode: "image",
    image: "talbinah-sachet-box.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "gift-box",
    nameAr: "بوكس الإهداء",
    nameEn: "Gift Box",
    price: 42,
    category: "boxes",
    displayMode: "image",
    image: "gift-box.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "al-jabirah-box",
    nameAr: "بوكس الجابرة",
    nameEn: "Al-Jabirah Box",
    price: 68,
    category: "boxes",
    displayMode: "image",
    image: "al-jabirah-box.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "sawiq-powder",
    nameAr: "بودرة سويق",
    nameEn: "Sawiq Powder",
    price: 24,
    category: "ready",
    displayMode: "image",
    image: "sawiq-powder.webp",
    imageFit: "cover",
    imagePosition: "center",
    branches: [...sharedBranches]
  },
  {
    id: "talbinah-powder",
    nameAr: "بودرة تلبينة نبوية",
    nameEn: "Talbinah Powder",
    price: 24,
    category: "ready",
    displayMode: "compact",
    branches: [...sharedBranches]
  },
  {
    id: "madini-crepe-cheese-signature",
    nameAr: "كريب مديني - أجبان سجنتشر",
    nameEn: "Madini Crepe - Cheese Signature",
    price: 9,
    category: "sweets",
    displayMode: "compact",
    branches: ["bustan"]
  }
];
