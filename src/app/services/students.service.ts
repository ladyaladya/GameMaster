import { Injectable } from '@angular/core';
import { Student } from '../models/student';

@Injectable({
    providedIn: 'root',
})
export class StudentsService {
    private students: Student[] = [
        { id: 1, name: 'Іван', mark: 11.5 },
        { id: 2, name: 'Тетяна', mark: 9.5 },
        { id: 3, name: 'Ярослав', mark: 11.7 },
        { id: 4, name: 'Микита', mark: 11.1 },
        { id: 5, name: 'Юлія', mark: 10.8 },
        { id: 6, name: 'Максим', mark: 10.4 },
        { id: 7, name: 'Данило', mark: 10.8 },
        { id: 8, name: 'Віктор', mark: 11.2 },
        { id: 9, name: 'Галина', mark: 11.5 },
        { id: 10, name: 'Павло', mark: 11.5 },
        { id: 11, name: 'Анна', mark: 11.4 },
        { id: 12, name: 'Євген', mark: 10.6 },
    ];

    getStudents(): Student[] {
        return this.students;
    }

    getStudentById(id: number): Student | undefined {
        return this.students.find(student => student.id === id);
    }

    getLeaders(count: number = 4): Student[] {
        return [...this.students]
            .sort((a, b) => b.mark - a.mark)
            .slice(0, count);
    }

    addStudent(student: Student): void {
        this.students.push(student);
    }

    updateStudent(id: number, updatedStudent: Partial<Student>): void {
        const student = this.getStudentById(id);
        if (student) {
            Object.assign(student, updatedStudent);
        }
    }

    removeStudent(id: number): void {
        this.students = this.students.filter(student => student.id !== id);
    }
}
