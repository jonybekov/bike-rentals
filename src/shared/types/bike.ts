import { SimpleField } from "./common";
import { Period } from "./reservation";

export type Color = { hex_code: string } & SimpleField;

export interface IBike {
  id: string;
  model: SimpleField;
  image?: string;
  location: SimpleField;
  color: Color;
  available?: boolean;
  avg_rate?: number;
}

export interface IBikeForm {
  model: SimpleField;
  image?: string;
  location: Color;
  color: SimpleField;
}

export interface IBikeFilter extends IBikeForm {
  period: Period<Date>;
  avgRate: number;
}
