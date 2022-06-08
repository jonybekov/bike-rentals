import { Timestamp } from "firebase/firestore";

export type Period<T = Timestamp | Date> = [T | null, T | null];

export interface IReservation {
  bikeId: string;
  id: string;
  period: Period<Timestamp>;
  userId: string;
}
