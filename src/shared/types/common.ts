export interface SimpleField {
  id: string;
  name: string;
}

export type IHasID<T> = {
  id: string;
} & T;
