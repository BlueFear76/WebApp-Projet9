import { Tag } from "./Tag";

export interface Tool {
    id: number;
    status?: string;
    name: string;
    lastKnownLocation?: string;
    rfidTagId?: string;
  }

  