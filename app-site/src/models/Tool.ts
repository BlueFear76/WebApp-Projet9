import { Tag } from "./Tag";


export interface Tool {
    id: number;
    type : string;
    status : string;
    last_known_latitude : number;
    last_known_longitude : number;
    last_scan_time : string;
    tag : Tag;
}