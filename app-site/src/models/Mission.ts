import { Car } from "./Car";
import { Employee } from "./Employee";
import { Tool } from "./Tool";
import { Travel } from "./Travel";

export interface Mission {
    id: number;
    description : string;
    start_time : string;
    end_time : string;
    duration : number;
    adress : string;
    longitude? : number;
    latitude? : number;
    tools : Tool[];
    cars : Car[];
    employees : Employee[];
    travel?: Travel;
}