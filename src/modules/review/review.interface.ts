export interface ICreateReviewPayload {
  rating: number;
  comment?: string;
  propertyId: string;
}

export interface IUpdateReviewPayload {
  rating?: number;
  comment?: string;
}
