import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Student {
    id: number;
    name: string;
}

interface Team {
    id: number;
    name: string;
    leader: Student | null;
    members: Student[];
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    students: Student[] = [
        { id: 1, name: 'Олександр' },
        // { id: 2, name: 'Марія' },
        // { id: 3, name: 'Іван' },
        // { id: 4, name: 'Анна' },
        // { id: 5, name: 'Володимир' },
        // { id: 6, name: 'Катерина' },
        // { id: 7, name: 'Дмитро' },
        // { id: 8, name: 'Олена' }
    ];

    teams: Team[] = [
        { id: 1, name: 'Червоні (Вогонь)', leader: null, members: [] },
        { id: 2, name: 'Сині (Вода)', leader: null, members: [] },
        { id: 3, name: 'Коричневі (Земля)', leader: null, members: [] },
        { id: 4, name: 'Зелені (Повітря)', leader: null, members: [] }
    ];

    constructor(private router: Router) { }

    addStudent(name: string) {
        if (name) {
            this.students.push({ id: this.students.length + 1, name });
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
