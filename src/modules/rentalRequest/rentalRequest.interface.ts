import { RentalRequestStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalRequestPayload {
  propertyId: string;
  moveInDate: Date;
  rentalDuration: number;
  monthlyRent: number;
  message?: string;
}

export interface IUpdateRentalRequestPayload {
  moveInDate?: Date;
  rentalDuration?: number;
  monthlyRent?: number;
  message?: string;
  status?: RentalRequestStatus;
}
