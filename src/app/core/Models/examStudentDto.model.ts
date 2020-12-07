import { StudentModel } from "./student.model";

export class ExamStudentDtoModel {

    examId: number;
    students: StudentModel;

    clear() {
        this.examId= 0;;
        this.students= new StudentModel;
    
    }
}