import { AssignExamStudentModel } from './assign-exam-student.model';

export class AssignExamStudentRequestDtoModel {
    examId: number;
    students: AssignExamStudentModel[];
}