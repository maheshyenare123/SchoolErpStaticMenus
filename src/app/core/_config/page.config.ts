export class PageConfig {
  public defaults: any = {
    dashboard: {
      page: {
        title: 'Dashboard',
        desc: 'Latest updates and statistic charts'
      },
    },

    'front-office': {

      admissionenqury: {
        page: { title: 'Admission Enquiry', desc: '' }
      },
      visitorbook: {
        page: { title: 'Visitor Book', desc: '' }
      },
      phonecalllog: {
        page: { title: 'Phone Call Log', desc: '' }
      },
      postaldispatch: {
        page: { title: 'Postal Dispatch', desc: '' }
      },
      postalreceive: {
        page: { title: 'Postal Receive', desc: '' }
      },
      
      complain: {
        page: { title: 'Complain', desc: '' }
      },

      'setup-front-office': {
        purpose: {
          page: { title: 'Purpose', desc: '' }
        },
        complaintype: {
          page: { title: 'Complain Type', desc: '' }
        },
        source: {
          page: { title: 'Source', desc: '' }
        },
        reference: {
          page: { title: 'Reference', desc: '' }
        }
      },

    },
    'student-information': {

      'student-details': {
        page: { title: 'Student Details', desc: '' }
      },
      'student-details-edit/:id': {
        page: { title: 'Student Admission', desc: '' }
      },
      // 'online-admission': {
      //   page: { title: 'Online Admission', desc: '' }
      // },
      // 'disabled-student': {
      //   page: { title: 'Disabled Student', desc: '' }
      // },
      // 'bulk-delete': {
      //   page: { title: 'Bulk Delete', desc: '' }
      // },
      'student-categories': {
        page: { title: 'Student Categories', desc: '' }
      },
      'student-house': {
        page: { title: 'Student House', desc: '' }
      },
      'disable-reason': {
        page: { title: 'Disable Reason', desc: '' }
      },
      
      
      
    },
    'academics': {
      
      'class-timetable': {
        page: { title: 'Class Timetable', desc: '' }
      },
      'teacher-timetable': {
        page: { title: 'Teacher Timetable', desc: '' }
      },
      'assign-class-teacher': {
        page: { title: 'Assign Class Teacher', desc: '' }
      },
      'class': {
        page: { title: 'Class', desc: '' }
      },
      'section': {
        page: { title: 'Section', desc: '' }
      },
      'subject': {
        page: { title: 'Subject', desc: '' }
      },
      'subject-group': {
        page: { title: 'Subject Group', desc: '' }
      },
         
    },
    'attendance': {
      'student-attendance': {
        page: { title: 'Student Attendance', desc: '' }
      },
      'attendance-by-date': {
        page: { title: 'Attendance By Date', desc: '' }
      },
      'approve-leave': {
        page: { title: 'Approve Leave', desc: '' }
      },
    },
    'homework': {
      'homework-list': {
        page: { title: 'Home Work', desc: '' }
      },
      
    },
    'library': {
      'book-list': {
        page: { title: 'Book List', desc: '' }
      },
      'library-member-list': {
        page: { title: 'Issue Return', desc: '' }
      },
      'library-student-member': {
        page: { title: 'Library Student Member', desc: '' }
      },
      'library-staff-member': {
        page: { title: 'Library Staff Member', desc: '' }
      },
    
      
    },

    'human-resource': {
      staff: {
        edit: {
          page: { title: 'Edit Staff', desc: '' }
        },
        add: {
          page: { title: 'Add Staff', desc: '' }
        }
      },
      
      // 'staff': {
      //   page: { title: 'Add Staff', desc: '' }
      // },
      'staff-directory': {
        page: { title: 'Staff Directory', desc: '' }
      },
      'staff-attendance': {
        page: { title: 'Staff Attendance', desc: '' }
      },
      'apply-leave': {
        page: { title: 'Apply Leave', desc: '' }
      },
      'approve-leave-request': {
        page: { title: 'Approve Leave Request', desc: '' }
      },
      'leave-type': {
        page: { title: 'Leave Type', desc: '' }
      },
      'department': {
        page: { title: 'Department', desc: '' }
      },
      'designation': {
        page: { title: 'Designation', desc: '' }
      },
      'payroll': {
        page: { title: 'Payroll', desc: '' }
      },
      'disabled-staff': {
        page: { title: 'Disabled Staff', desc: '' }
      },
      'staff-rating': {
        page: { title: 'Staff Rating', desc: '' }
      },
      
    },

    'fees-collection': {
      
      'fees-type': {
        page: { title: 'Fees Type', desc: '' }
      },
      'fees-group': {
        page: { title: 'Fees Group', desc: '' }
      },
      'fees-discount': {
        page: { title: 'Fees Discount', desc: '' }
      },
      'fees-master': {
        page: { title: 'Fees Master', desc: '' }
      },
      'fees-collect': {
        page: { title: 'Fees Collect', desc: '' }
      },
      'search-fees-payment': {
        page: { title: 'Search Fees Payment', desc: '' }
      },
      'search-due-fees': {
        page: { title: 'Search Due Fees', desc: '' }
      },
      
      
      'fees-reminder': {
        page: { title: 'Fees Reminder', desc: '' }
      },
      
    },

    'income': {
      'add-income': {
        page: { title: 'Add Income', desc: '' }
      },
      'search-income': {
        page: { title: 'Search Income', desc: '' }
      },
      'income-head': {
        page: { title: 'Income Head', desc: '' }
      },
    },

    'expense': {
      'add-expense': {
        page: { title: 'Add Expense', desc: '' }
      },
      'search-expense': {
        page: { title: 'Search Expense', desc: '' }
      },
      'expense-head': {
        page: { title: 'Expense Head', desc: '' }
      },
    },

    'transport': {
      'routes': {
        page: { title: 'Routes', desc: '' }
      },
      'vehicles': {
        page: { title: 'Vehicles', desc: '' }
      },
      'assign-vehicle': {
        page: { title: 'Assign Vehicle', desc: '' }
      },
    },


    'hostel': {
      'hostel': {
        page: { title: 'Hostel', desc: '' }
      },
      'room-type': {
        page: { title: 'Room Type', desc: '' }
      },
      'hostel-room': {
        page: { title: 'Hostel Room', desc: '' }
      },
    },
    'inventory': {
      'item-category': {
        page: { title: 'Item Category', desc: '' }
      },
      'add-item': {
        page: { title: 'Add Item', desc: '' }
      },
      'item-store': {
        page: { title: 'Item Store', desc: '' }
      },
      'item-supplier': {
        page: { title: 'Item Supplier', desc: '' }
      },
      'item-stock': {
        page: { title: 'Item Stock', desc: '' }
      },
      'item-issue': {
        page: { title: 'Item Issue', desc: '' }
      },
    },
    
    'examination': {
      'exam-group': {
        page: { title: 'Exam Group', desc: '' }
      },
      'exam-schedule': {
        page: { title: 'Exam Schedule', desc: '' }
      },
      'exam/:id': {
        page: { title: 'Exam', desc: '' }
      },
      'examSubjectMarks/:examId/:examSubjectId/:examGroupId': {
        page: { title: 'Exam Subject Marks', desc: '' }
      },
      'exam-result': {
        page: { title: 'Exam Result', desc: '' }
      },

      
    },

    'certificate': {
      'certificate-design': {
        page: { title: 'Certificate Design', desc: '' }
      },
      
    },

    'communication': {
      'notice-board': {
        page: { title: 'Notice Board', desc: '' }
      },
      'send-email': {
        page: { title: 'Send Email', desc: '' }
      },
      'send-sms': {
        page: { title: 'Send Sms', desc: '' }
      },
      'email-sms-log': {
        page: { title: 'Email Sms Log', desc: '' }
      },
    },


    'report': {
      'student-information': {
        page: { title: 'Student Information', desc: '' }
      },
      'student-report': {
        page: { title: 'Student Report', desc: '' }
      },
      'guardian-report': {
        page: { title: 'Guardian Report', desc: '' }
      },
      'student-history': {
        page: { title: 'Student History', desc: '' }
      },
      'student-login-credential': {
        page: { title: 'Student Login Credential', desc: '' }
      },
      'class-subject-report': {
        page: { title: 'Class Subject Report', desc: '' }
      },
      'admission-report': {
        page: { title: 'Admission Report', desc: '' }
      },
      'sibling-report': {
        page: { title: 'Sibling Report', desc: '' }
      },
      'student-profile': {
        page: { title: 'Student Profile', desc: '' }
      },
      'homework-evaluation-report': {
        page: { title: 'Homework Evaluation Report', desc: '' }
      },
      'finance': {
        page: { title: 'Finance', desc: '' }
      },


      'fees-statement': {
        page: { title: 'Fees Statement', desc: '' }
      },
      'balance-fees-report': {
        page: { title: 'Balance Fees Report', desc: '' }
      },
      'fees-collection-report': {
        page: { title: 'Fees Collection Report', desc: '' }
      },
      'online-fees-collection-report': {
        page: { title: 'Online Fees Collection Report', desc: '' }
      },
      'income-report': {
        page: { title: 'Income Report', desc: '' }
      },
      'expense-report': {
        page: { title: 'Expense Report', desc: '' }
      },
      'payroll-report': {
        page: { title: 'Payroll Report', desc: '' }
      },
      'income-group-report': {
        page: { title: 'Income Group Report', desc: '' }
      },
      'expense-group-report': {
        page: { title: 'Expense Group Report', desc: '' }
      },


      'human-resource-report': {
        page: { title: 'Human Resource', desc: '' }
      },
      'staff-report': {
        page: { title: 'Staff Report', desc: '' }
      },
      'payrolls-report': {
        page: { title: 'Payrolls Report', desc: '' }
      },


      'library-report': {
        page: { title: 'Library', desc: '' }
      },
      'book-issue-report': {
        page: { title: 'Book Issue Report', desc: '' }
      },
      'book-due-report': {
        page: { title: 'Book Due Report', desc: '' }
      },
      'book-inventory-report': {
        page: { title: 'Book Inventory Report', desc: '' }
      },
      'book-issue-return-report': {
        page: { title: 'Book Issue Return Report', desc: '' }
      },


      'inventory-report': {
        page: { title: 'Inventory', desc: '' }
      },
      'stock-report': {
        page: { title: 'Stock Report', desc: '' }
      },
      'add-item-report': {
        page: { title: 'Add Item Report', desc: '' }
      },
      'issue-item-report': {
        page: { title: 'Issue Item Report', desc: '' }
      },


      'transport-report': {
        page: { title: 'Transport', desc: '' }
      },
      'hostel-report': {
        page: { title: 'Hostel', desc: '' }
      },
    },


    'system-setting': {
      'roles': {
        page: { title: 'Roles Permissions', desc: '' }
      },
      'sessions': {
        page: { title: 'Session Setting', desc: '' }
      },
      'email_setting': {
        page: { title: 'Email Setting', desc: '' }
      },
      'sms_setting': {
        page: { title: 'Sms Setting', desc: '' }
      },
      'backup_restore': {
        page: { title: 'Backup Restore', desc: '' }
      },
      'notification_setting': {
        page: { title: 'Notification Setting', desc: '' }
      },
      'users': {
        page: { title: 'Users', desc: '' }
      },
    },


    ecommerce: {
      customers: {
        page: { title: 'Customers', desc: '' }
      },
      products: {
        edit: {
          page: { title: 'Edit product', desc: '' }
        },
        add: {
          page: { title: 'Create product', desc: '' }
        }
      },
      orders: {
        page: { title: 'Orders', desc: '' }
      }
    },
    'user-management': {
      users: {
        page: { title: 'Users', desc: '' }
      },
      roles: {
        page: { title: 'Roles', desc: '' }
      }
    },
    builder: {
      page: { title: 'Layout Builder', desc: '' }
    },
    header: {
      actions: {
        page: { title: 'Actions', desc: 'Actions example page' }
      }
    },
    profile: {
      page: { title: 'User Profile', desc: '' }
    },
    error: {
      404: {
        page: { title: '404 Not Found', desc: '', subheader: false }
      },
      403: {
        page: { title: '403 Access Forbidden', desc: '', subheader: false }
      }
    },
    wizard: {
      'wizard-1': { page: { title: 'Wizard 1', desc: '' } },
      'wizard-2': { page: { title: 'Wizard 2', desc: '' } },
      'wizard-3': { page: { title: 'Wizard 3', desc: '' } },
      'wizard-4': { page: { title: 'Wizard 4', desc: '' } },
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
