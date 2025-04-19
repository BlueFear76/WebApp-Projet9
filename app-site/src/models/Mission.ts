import { Employee } from "./Employee";


export interface Mission {
    id: number;
    name: string;
    description: string;
    address: string;
    startDate: Date;
    endDate: Date;
    vehicleId: number;
    assignedToolNames: string[];
    customerId: number;
  };

export interface MissionDTO{
    name : string;
    description : string;
    address : string;
    startDate : Date;
    endDate : Date;
    employeeIds?: Employee[];
    VehicleId?: number;
    customerId: number;
}