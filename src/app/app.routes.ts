import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { AnswerQuestionsComponent } from './answer-questions/answer-questions.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'game', component: GameComponent },
    { path: 'game/answer/:topic', component: AnswerQuestionsComponent },
];
