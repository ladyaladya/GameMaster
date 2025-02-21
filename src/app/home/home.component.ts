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

    constructor(
        private router: Router,
        private studentsService: StudentsService,
        private teamsService: TeamsService,
    ) { }

    ngOnInit(): void {
        this.students$ = this.studentsService.students$;
        this.leaders$ = this.students$.pipe(
            map(students => students.sort((a, b) => b.mark - a.mark).slice(0, 4))
        );
        this.teams$ = this.teamsService.teams$;
    }

    selectLeader(event: any, team: Team) {
        const selectedStudentId = event.target.value;
        this.students$.subscribe(students => {
            const selectedStudent = students.find(s => s.id === parseInt(selectedStudentId));

            if (selectedStudent) {
                team.leader = selectedStudent;

                // Додаємо лідера до членів команди
                if (!team.members.some(member => member.id === selectedStudent.id)) {
                    team.members.push(selectedStudent);
                }

                this.setStudentImage(selectedStudent, team);
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
            // Створюємо масив студентів без лідерів
            const remainingStudents = students.filter(student =>
                !this.teamsService.getTeams().some(team => team.leader?.id === student.id)
            );

            // Перемішуємо залишкових студентів
            let shuffledStudents = this.shuffleArray(remainingStudents);
            let teamIndex = 0;

            // Розподіляємо студентів по командам
            this.teamsService.getTeams().forEach(team => {
                team.members = [];
            });

            for (const student of shuffledStudents) {
                const team = this.teamsService.getTeams()[teamIndex];
                if (!team.leader) {
                    team.leader = student; // Призначаємо лідера
                } else {
                    team.members.push(student);
                }
                teamIndex = (teamIndex + 1) % this.teamsService.getTeams().length;
            }

            this.teams$ = this.teamsService.teams$; // Оновлюємо teams$
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
