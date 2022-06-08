import { SimpleField } from "./common";

export type Color = { hex_code: string } & SimpleField;

export interface IBike {
  id: string;
  model: SimpleField;
  image?: string;
  location: SimpleField;
  color: Color;
  available?: boolean;
}

export interface IBikeForm {
  model: SimpleField;
  image?: string;
  location: Color;
  color: SimpleField;
}
