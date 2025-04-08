import { Car } from "./Car";

export interface Reader {
    id: number;
    status : string;
    assignation_date: string;
    car : Car
}