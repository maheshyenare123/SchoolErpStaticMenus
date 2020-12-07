export class ExamSubjectModel {

    creditHours: number;
    dateFrom: string;
    dateTo: string;
    duration: string;
    examId: number;
    examSubjectId: number;
    maxMarks: number;
    minMarks: number;
    roomNo: string;
    subjectId: number;
    subjectName: string;
    timeFrom: string;

    clear() {

        this.creditHours = 0;
        this.dateFrom = '';
        this.dateTo = '';
        this.duration = '';
        this.examId = 0;
        this.examSubjectId = 0;
        this.maxMarks = 0;
        this.minMarks = 0;
        this.roomNo = '';
        this.subjectId = 0;
        this.subjectName = '';
        this.timeFrom = '';

    }
}