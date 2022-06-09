import { Timestamp } from "firebase/firestore";

export type Period<T = Timestamp | Date> = [T | null, T | null];
export type PeriodMap = {
  start: Timestamp | null;
  end: Timestamp | null;
};

export interface IReservation {
  bikeId: string;
  id: string;
  period: PeriodMap;
  userId: string;
}
