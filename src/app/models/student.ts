import { TeamType } from "./team-type";

export interface Student {
    id: number;
    name: string;
    mark: number;
    isMale: boolean;
    teamType?: TeamType;
    imagePath?: string;
}