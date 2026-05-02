export interface MarketplaceSeller {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  condition: string;
  category: string;
  location: string;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  seller: MarketplaceSeller;
  _count?: { favoritedBy: number };
}
