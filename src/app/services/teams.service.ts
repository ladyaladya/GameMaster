import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Team } from '../models/team';
import { TeamType } from '../models/team-type';

@Injectable({
    providedIn: 'root',
})
export class TeamsService {
    private teamsSubject = new BehaviorSubject<Team[]>([
        { id: 1, name: 'Фракція Вогню', teamType: TeamType.Pyro, internalName: 'pyro', leader: null, members: [] },
        { id: 2, name: 'Фракція Води', teamType: TeamType.Hydro, internalName: 'hydro', leader: null, members: [] },
        { id: 3, name: 'Фракція Землі', teamType: TeamType.Geo, internalName: 'geo', leader: null, members: [] },
        { id: 4, name: 'Фракція Повітря', teamType: TeamType.Anemo, internalName: 'anemo', leader: null, members: [] }
    ]);

    teams$ = this.teamsSubject.asObservable(); // Публічний Observable

    getTeams(): Team[] {
        return this.teamsSubject.getValue();
    }

    updateTeam(id: number, updatedTeam: Partial<Team>): void {
        const teams = this.teamsSubject.getValue();
        const index = teams.findIndex(team => team.id === id);
        if (index !== -1) {
            teams[index] = { ...teams[index], ...updatedTeam };
            this.teamsSubject.next([...teams]);
        }
    }
}