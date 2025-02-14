import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

interface Player {
    student: Student;
    team: Team;
}

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent {
    teams: Team[] = [];
    players: Player[] = [];
    currentPlayerIndex: number = 0;
    currentPlayer: Player | null = null;
    availableQuestions: string[] = ['HTML', 'CSS', 'JavaScript']; // Список тем
    hasAnswered: boolean = false; // Статус для відслідковування, чи відповів гравець

    constructor(private router: Router) {
        const storedTeams = localStorage.getItem('gameTeams');
        if (storedTeams) {
            this.teams = JSON.parse(storedTeams);
        } else {
            console.error('No game teams found in localStorage');
        }
        this.generateTurnOrder();
    }

    // Генерація черговості для студентів
    generateTurnOrder() {
        this.players = []; // Очищаємо список перед додаванням нових гравців
        this.teams.forEach(team => {
            team.members.forEach(member => {
                this.players.push({ student: member, team });
            });
        });

        // Перевіряємо, чи всі гравці потрапили в список
        console.log('Players:', this.players);

        // Перемішуємо список студентів
        this.players = this.shuffleArray(this.players);
        this.currentPlayer = this.players[this.currentPlayerIndex];
    }

    // Перемішування масиву
    shuffleArray(array: any[]): any[] {
        return array.sort(() => Math.random() - 0.5);
    }

    // Перехід до наступного гравця
    nextTurn() {
        if (this.hasAnswered) {
            if (this.currentPlayerIndex < this.players.length - 1) {
                this.currentPlayerIndex++;
                this.currentPlayer = this.players[this.currentPlayerIndex];
                this.hasAnswered = false; // Скидаємо статус після переходу
            } else {
                this.endGame();
            }
        } else {
            alert('Студент ще не відповів на питання!');
        }
    }

    // Завершення гри
    endGame() {
        // Зберігаємо оновлені дані в localStorage
        localStorage.setItem('gameTeams', JSON.stringify(this.teams));
        this.router.navigate(['/result']);
    }

    // Обрання теми для запитання
    selectTopic(topic: string) {
        console.log(`${this.currentPlayer?.student.name} вибрав тему: ${topic}`);
        this.router.navigate([`/game/answer/${topic}`]); // Перехід до нового компонента для питань
    }

    // Отримання результатів
    setAnswered() {
        this.hasAnswered = true; // Після того, як студент відповів, ставимо статус
    }
}
