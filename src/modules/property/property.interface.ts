export interface ICreatePropertyPayload {
  title: string;
  description: string;
  address: string;
  city: string;
  area: string;

  rentPrice: number;
  bedrooms: number;
  bathrooms: number;

  isAvailable?: boolean;

  categoryId: string;

  amenities?: string[];
  images?: string[];
}

export interface IUpdatePropertyPayload {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  area?: string;

  rentPrice?: number;
  bedrooms?: number;
  bathrooms?: number;

  isAvailable?: boolean;

  categoryId?: string;

  amenities?: string[];
  images?: string[];
}
