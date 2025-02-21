import { Student } from './student';
import { TeamType } from './team-type';

export interface Team {
    id: number;
    name: string;
    teamType: TeamType;
    leader: Student | null;
    members: Student[];
}