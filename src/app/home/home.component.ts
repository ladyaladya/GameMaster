import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Student } from '../models/student';
import { Team } from '../models/team';
import { StudentsService } from '../services/students.service';
import { TeamsService } from '../services/teams.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamType } from '../models/team-type';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    students$!: Observable<Student[]>;
    leaders$!: Observable<Student[]>;
    teams$!: Observable<Team[]>;
    areTeamsGenerated = false;

    constructor(
        private router: Router,
        private studentsService: StudentsService,
        private teamsService: TeamsService,
    ) { }

    ngOnInit(): void {
        this.students$ = this.studentsService.students$;
        this.leaders$ = this.students$.pipe(
            map(students => students.sort((a, b) => b.mark - a.mark).slice(0, 3))
        );
        this.teams$ = this.teamsService.teams$;
    }

    assignLeaderToTeam(event: any, leader: Student) {
        const selectedTeamInternalName = event.target.value;

        this.teams$.subscribe(teams => {
            const selectedTeam = teams.find(team => team.internalName === selectedTeamInternalName);

            if (selectedTeam) {
                // Призначаємо лідера команді
                selectedTeam.leader = leader;

                // Додаємо лідера до членів команди (якщо його там немає)
                if (!selectedTeam.members.some(member => member.id === leader.id)) {
                    selectedTeam.members.push(leader);
                }

                // Встановлюємо шлях до зображення
                this.setStudentImage(leader, selectedTeam);
            }
        });
    }

    addStudent(name: string) {
        if (name) {
            const newStudent: Student = {
                id: Math.floor(Math.random() * 1000),
                name,
                mark: Math.random() * 12,
                isMale: Math.random() > 0.5,
            };
            this.studentsService.addStudent(newStudent);
        }
    }

    startGame() {
        this.teams$.subscribe(teams => {
            localStorage.setItem('gameTeams', JSON.stringify(teams));
            this.router.navigate(['/game']);
        });
    }

    generateTeams() {
        this.students$.subscribe(students => {
            // Отримуємо всі команди
            const teams = this.teamsService.getTeams();

            // Фільтруємо студентів, які ще не є лідерами
            const remainingStudents = students.filter(student =>
                !teams.some(team => team.leader?.id === student.id)
            );

            // Перемішуємо залишкових студентів
            const shuffledStudents = this.shuffleArray(remainingStudents);
            let teamIndex = 0;

            // Очищаємо лише учасників команд (залишаючи лідерів)
            teams.forEach(team => {
                team.members = team.members.filter(member => member.id === team.leader?.id);
            });

            // Розподіляємо студентів по командам
            for (const student of shuffledStudents) {
                const team = teams[teamIndex];

                // Додаємо студента в команду, якщо він ще не є лідером
                if (!team.members.some(member => member.id === student.id)) {
                    team.members.push(student);
                }

                teamIndex = (teamIndex + 1) % teams.length;
            }

            // Оновлюємо teams$
            this.teams$ = this.teamsService.teams$;
            this.areTeamsGenerated = true;
        });
    }

    shuffleArray(array: Student[]): Student[] {
        return array.sort(() => Math.random() - 0.5);
    }

    setStudentImage(student: Student, team: Team) {
        const studentIndex = team.members.indexOf(student);
        if (studentIndex !== -1) {
            const gender = student.isMale ? 'male' : 'female';
            const imagePath = `images/characters/${team.internalName}/${gender}/${studentIndex + 1}.webp`;
            student.imagePath = imagePath;
        } else {
            console.warn(`Student ${student.name} is not a member of team ${team.name}`);
        }
    }


    isLeader(student: Student): boolean {
        return this.teamsService.getTeams().some(team => team.leader?.id === student.id);
    }
}
