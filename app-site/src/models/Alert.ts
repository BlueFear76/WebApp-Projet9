import { Mission } from "./Mission";


export interface Alert {
    id: number;
    toolTagId: string[];
    message: string;
    mission: Mission;
  }