import { Reader } from "./Reader";

export interface Car {
    licence_plate: string;
    car_type: string;
    readers : Reader[];
}