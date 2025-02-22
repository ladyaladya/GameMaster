import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
    providedIn: 'root',
})
export class StudentsService {
    private studentsSubject = new BehaviorSubject<Student[]>([
        { id: 1, name: 'Іван', mark: 11.5, isMale: true },
        { id: 2, name: 'Тетяна', mark: 9.5, isMale: false },
        { id: 3, name: 'Ярослав', mark: 11.7, isMale: true },
        { id: 4, name: 'Микита', mark: 11.1, isMale: true },
        { id: 5, name: 'Юлія', mark: 10.8, isMale: false },
        { id: 6, name: 'Максим', mark: 10.4, isMale: true },
        { id: 7, name: 'Данило', mark: 10.8, isMale: true },
        { id: 8, name: 'Віктор', mark: 11.2, isMale: true },
        { id: 9, name: 'Галина', mark: 11.5, isMale: false },
        { id: 10, name: 'Павло', mark: 11.5, isMale: true },
        { id: 11, name: 'Анна', mark: 11.4, isMale: false },
        { id: 12, name: 'Євген', mark: 10.6, isMale: true },
    ]);

    students$ = this.studentsSubject.asObservable(); // Публічний Observable

    getStudents(): Student[] {
        return this.studentsSubject.getValue(); // Отримуємо поточний список
    }

    getLeaders(count: number = 3): Student[] {
        return [...this.studentsSubject.getValue()]
            .sort((a, b) => b.mark - a.mark)
            .slice(0, count);
    }

    addStudent(student: Student): void {
        const updatedStudents = [...this.studentsSubject.getValue(), student];
        this.studentsSubject.next(updatedStudents); // Оновлення
    }

    updateStudent(id: number, updatedStudent: Partial<Student>): void {
        const students = this.studentsSubject.getValue();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...updatedStudent };
            this.studentsSubject.next([...students]); // Оновлення списку
        }
    }

    removeStudent(id: number): void {
        const updatedStudents = this.studentsSubject.getValue().filter(s => s.id !== id);
        this.studentsSubject.next(updatedStudents); // Оновлення списку
    }
}