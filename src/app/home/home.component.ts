import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Student } from '../models/student';
import { Team } from '../models/team';
import { StudentsService } from '../services/students.service';
import { TeamType } from '../models/team-type';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    students: Student[] = [];
    leaders: Student[] = [];
    imagePath: string = 'images/characters/hydro/furina.webp';

    teams: Team[] = [
        { id: 1, name: 'Фракція Вогню', teamType: TeamType.Pyro, leader: null, members: [] },
        { id: 2, name: 'Фракція Води', teamType: TeamType.Hydro, leader: null, members: [] },
        { id: 3, name: 'Фракція Землі', teamType: TeamType.Geo, leader: null, members: [] },
        { id: 4, name: 'Фракція Повітря', teamType: TeamType.Anemo, leader: null, members: [] }
    ];

    constructor(private router: Router,
        private studentsService: StudentsService
    ) { }

    ngOnInit(): void {
        this.students = this.studentsService.getStudents();
        this.leaders = this.studentsService.getLeaders();
    }

    addStudent(name: string) {
        if (name) {
            // this.students.push({ id: this.students.length + 1, name });
        }
    }

    selectLeader(event: any, team: Team) {
        const selectedStudentId = event.target.value;
        const selectedStudent = this.students.find(s => s.id === parseInt(selectedStudentId));

        if (selectedStudent) {
            // Встановлюємо лідера для команди
            team.leader = selectedStudent;

            // Додаємо лідера до членів команди
            if (!team.members.some(member => member.id === selectedStudent.id)) {
                team.members.push(selectedStudent);
            }
        }
    }


    isLeader(student: Student): boolean {
        // Перевіряємо, чи є студент лідером у будь-якій команді
        return this.teams.some(team => team.leader?.id === student.id);
    }

    generateTeams() {
        // Створюємо масив студентів без лідерів
        const remainingStudents = this.students.filter(student =>
            !this.teams.some(team => team.leader?.id === student.id)
        );

        // Перемішуємо залишкових студентів
        let shuffledStudents = this.shuffleArray(remainingStudents);
        let teamIndex = 0;

        // Розподіляємо студентів по командам
        for (const student of shuffledStudents) {
            // Перевірка наявності лідера в команді
            if (!this.teams[teamIndex].leader) {
                this.teams[teamIndex].leader = student; // Призначаємо лідера
            } else {
                this.teams[teamIndex].members.push(student);
            }
            teamIndex = (teamIndex + 1) % this.teams.length;
        }
    }



    shuffleArray(array: Student[]): Student[] {
        return array.sort(() => Math.random() - 0.5);
    }

    startGame() {
        localStorage.setItem('gameTeams', JSON.stringify(this.teams));
        this.router.navigate(['/game']);
    }
}
