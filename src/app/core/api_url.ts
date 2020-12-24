export class Constants {
   public static URL: any = {
      // HOST_URL: 'http://yamistha.cloudjiffy.net/',
      // HOST_URL: 'http://3.140.52.88:8080/',
      HOST_URL: 'http://localhost:8080/',
      accessToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdXBlcmFkbWluQGdtYWlsLmNvbSIsIlNlc3Npb25JRCI6MSwiaWF0IjoxNjA1NjgwNTE4LCJleHAiOjE2MDU3NjY5MTh9.ylU_vhIgkXCnK_JPjpzUB2o-if_vtSf0eSTu4t-XQnk-MuolPdbe1W7rQvYagANBzlU3efKk8U57FqfMqiIFOg',
      sessionId: '1',
// http://3.140.52.88:8080/swagger-ui.html#
   }


   public static DISPATCH: string = 'dispatch';
   public static RECEIVE: string = 'receive';
   public static HOLIDAY: string = 'holiday';
   public static PRESENT: string = 'present';


   public static Front_Office: any = {
      Admission_Enquiry: 'api/enquiry',
      Complain: 'api/complaint',
      ComplainType: 'api/complaint-type',
      Phone_Call_Log: 'api/general-call',
      Postal_Dispatch: 'api/dispatch-receive',
      Postal_Receive: 'api/dispatch-receive',
      Visitor_Book: 'api/visitors-book',
      Visitor_Purpose: 'api/visitor-purpose',
      Reference: 'api/reference',
      Source: 'api/source',
   }

   public static Student_Information: any = {
      Student: 'api/student',
      Student_Category: 'api/category',
      Disable_Reason: 'api/disable-reason',
      Student_House: 'api/school-house',
      Disable_Student: 'api/student/api/disable-student',
      Online_Addmission: 'api/',
      User:'api/user'

   }

   public static Academics: any = {
      Class_TimeTable: 'api/subject-class-timetable',
      Teacher_TimeTable: 'api/staff-timetable',
      Assign_Class_Teacher: 'api/assign-class-teacher',
      Class: 'api/class',
      Section: 'api/section',
      Subject: 'api/subject',
      Subject_Group: 'api/subject-group',
     
   }

   public static Attendance: any = {

      Approve_Leave: 'api/student-apply-leave',
      //   Attendance_By_Date:'',
      Student_Attendance: 'api/student-attendance',
      Attendance_Type: 'api/attendance-type'
   }


   public static Homework: any = {

      Homework_Add: 'api/homework',
      Homework_Evaluation:'api/homework-evaluation'

   }
   public static Library: any = {

      Book: 'api/book',
      Library_Member: 'api/library-member',
      Library_student_Member: 'api/library-member/student',
      Library_Staff_Member: 'api/library-member/staff',
      Book_Issue_Return: 'api/library-member/issue'
   }


   public static Human_Resource: any = {
      Staff: 'api/staff',
      Staff_Designation: 'api/staffdesignation',
      Department: 'api/department',
      Leave_Type: 'api/leave-type',
      Staff_Leave:'api/staff-leave',
      Staff_Leave_Request:'api/staff-leave-request',
      Staff_Leave_Details:'api/staff-leave-details',
      Staff_Payroll: 'api/staff-payroll',
      Staff_Rating: 'api/staff-rating',
      Staff_Attendance: 'api/staff-attendance',
      Roles:'api/role',
      User:'api/user'
   }

   public static Fees_Collection: any = {
      Fees_Group: 'api/fee-group',
      Fees_Type: 'api/fee-type',
      Fees_Discount: 'api/fee-discount',
      Fees_Master: 'api/feemaster',
      AssignStudentFeemaster: 'api/feemaster/assign/student',
      AssignStudentFeediscount: 'api/fee-discount/assign/student',
      Student_Fee_Deposite: 'api/student-fee-deposite',
      Student_Discount:'api/student-discount'
   }




   public static Incomes: any = {
      Income: 'api/income',
      IncomeHead: 'api/income-head',
   }

   public static Expenses: any = {
      Expense: 'api/expense',
      ExpenseHead: 'api/expense-head',
   }
  
   public static Transports: any = {
      Route: 'api/transport-route',
      Vehicle: 'api/vehicle',
      AssignVehicle: 'api/vehicle-route',
   }

   
   public static Hostels: any = {
      Hostel: 'api/hostel',
      RoomType: 'api/room-type',
      HostelRoom: 'api/hostel-room',
   }
   public static Inventory: any = {
      ItemCategory: 'api/item-category',
      AddItem: 'api/item',
      HostelRoom: 'api/hostel-room',
      ItemStore: 'api/item-Store',
      ItemSupplier: 'api/item-supplier',
      ItemStock: 'api/item-stock',
      ItemIssue: 'api/item-issue'
   }
   
   public static Exams: any = {
      ExamGroup: 'api/exam-group',
      Exam: 'api/exam',
      HostelRoom: 'api/hostel-room',
      AssignStudentExam: 'api/exam/students',
      ExamSubject: 'api/exam/subjects',
      ExamSubjectMarks: 'api/exam/subjects/marks'
   } 
   
   public static System_Settings: any = {
      Session:'api/session',
      Email:'api/email',
      Sms:'api/sms',
   
   
      
      }

}