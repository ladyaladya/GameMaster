import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameComponent } from '../game/game.component';

@Component({
    selector: 'app-answer-questions',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './answer-questions.component.html',
    styleUrls: ['./answer-questions.component.scss']
})
export class AnswerQuestionsComponent implements OnInit, OnDestroy {
    selectedTopic: string | null = null;
    questions: string[] = [];
    currentQuestionIndex: number = 0;
    timer: number = 60; // 1 хвилина на відповідь
    interval: any;
    score: number = 0;

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        // Отримуємо тему з параметра маршруту
        this.selectedTopic = this.route.snapshot.paramMap.get('topic');
        if (this.selectedTopic) {
            this.loadQuestionsForTopic(this.selectedTopic);
        }

        // Запускаємо таймер
        this.startTimer();
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    loadQuestionsForTopic(topic: string): void {
        // Завантажуємо питання за темою (приклад)
        switch (topic) {
            case 'HTML':
                this.questions = ['Що таке HTML?', 'Що таке тег?'];
                break;
            case 'CSS':
                this.questions = ['Що таке CSS?', 'Що таке flexbox?'];
                break;
            case 'JavaScript':
                this.questions = ['Що таке JavaScript?', 'Що таке змінні?'];
                break;
            default:
                this.questions = [];
        }
    }

    startTimer(): void {
        this.interval = setInterval(() => {
            if (this.timer > 0) {
                this.timer--;
            } else {
                this.endQuestion();
            }
        }, 1000);
    }

    answerQuestion(isCorrect: boolean): void {
        if (isCorrect) {
            this.score++;
        }
        this.endQuestion();
    }

    skipQuestion(): void {
        this.endQuestion();
    }

    endQuestion(): void {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.timer = 60; // Скидаємо таймер на наступне питання
            this.startTimer();
        } else {
            this.endRound();
        }
    }

    endRound(): void {
        // Перехід назад до гри
        // alert(`Ти набрав ${this.score} балів у раунді!`);
        this.router.navigate(['/game']); // Повертаємося до гри
    }
}
