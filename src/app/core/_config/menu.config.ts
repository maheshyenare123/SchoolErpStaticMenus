export class MenuConfig {
  public defaults: any = {
    // header: {
    //   // self: {},
    //   // items: [
    //   //   {
    //   //     title: 'Dashboards',
    //   //     root: true,
    //   //     alignment: 'left',
    //   //     page: '/dashboard',
    //   //     translate: 'MENU.DASHBOARD',
    //   //   },
    //     // {
    //     //   title: 'Front Office',
    //     //   bullet: 'dot',
    //     //   icon: 'flaticon-interface-7',
    //     //   submenu: [
    //     //     {
    //     //       title: 'Admission Enquiry',
    //     //       page: '/frontoffice/admissionenqury'
    //     //     },
    //     //     {
    //     //       title: 'Visitor Book',
    //     //       page: '/frontoffice/visitorbook'
    //     //     },
    //     //     {
    //     //       title: 'Phone Call Log',
    //     //       page: '/frontoffice/phonecalllog'
    //     //     },
    //     //     {
    //     //       title: 'Postal Dispatch',
    //     //       page: '/frontoffice/postaldispatch'
    //     //     },
    //     //     {
    //     //       title: 'Complain',
    //     //       page: '/frontoffice/complain'
    //     //     },
    //     //     {
    //     //       title: 'Setup Front Office ',
    //     //       bullet: 'dot',
    //     //       submenu: [
    //     //         {
    //     //           title: 'Purpose',
    //     //           page: '/frontoffice/setup-front-office/purpose',
    //     //           // permission: 'accessToECommerceModule'
    //     //         },
    //     //         {
    //     //           title: 'Complain Type',
    //     //           page: '/frontoffice/setup-front-office/complaintype',
    //     //         },
    //     //         {
    //     //           title: 'Source',
    //     //           page: '/frontoffice/setup-front-office/source',
    //     //         },
    //     //         {
    //     //           title: 'Reference',
    //     //           page: '/frontoffice/setup-front-office/reference',
    //     //         },
                
    //     //       ]
    //     //     },
            
    //     //   ]
    //     // },
       
       
       
       
    //   ]
    // },
    aside: {
      self: {},
      items: [
        {
          title: 'Dashboard',
          root: true,
          icon: 'flaticon2-architecture-and-city',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
          bullet: 'dot',
        },
      
        {
          title: 'Front Office',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            {
              title: 'Admission Enquiry',
              page: '/front-office/admissionenqury'
            },
            {
              title: 'Visitor Book',
              page: '/front-office/visitorbook'
            },
            {
              title: 'Phone Call Log',
              page: '/front-office/phonecalllog'
            },
            {
              title: 'Postal Dispatch',
              page: '/front-office/postaldispatch'
            },{
              title: 'Postal Receive',
              page: '/front-office/postalreceive'
            },
            
            {
              title: 'Complain',
              page: '/front-office/complain'
            },
            {
              title: 'Setup Front Office ',
              bullet: 'dot',
              submenu: [
                {
                  title: 'Purpose',
                  page: '/front-office/setup-front-office/purpose',
                  // permission: 'accessToECommerceModule'
                },
                {
                  title: 'Complain Type',
                  page: '/front-office/setup-front-office/complaintype',
                },
                {
                  title: 'Source',
                  page: '/front-office/setup-front-office/source',
                },
                {
                  title: 'Reference',
                  page: '/front-office/setup-front-office/reference',
                },
                
              ]
            },
            
          ]
        },
        {
          title: 'Student Information',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            {
              title: 'Student Details ',
              page: '/student-information/student-details'
            },
            {
              title: 'Student Admission',
              page: '/student-information/student-details-edit/:id'
            },
            // {
            //   title: 'Online Admission',
            //   page: '/student-information/online-admission'
            // },
            // {
            //   title: 'Disabled Student',
            //   page: '/student-information/disabled-student'
            // },
            // {
            //   title: 'Bulk Delete',
            //   page: '/student-information/bulk-delete'
            // },
            {
              title: 'Student Categories',
              page: '/student-information/student-categories'
            },
            {
              title: 'Student House',
              page: '/student-information/student-house'
            },
            {
              title: 'Disable Reason',
              page: '/student-information/disable-reason'
            },
           
            
          ]
        },
        {
          title: 'Academics',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Class Timetable',
              page: '/academics/class-timetable'
            },

            {
              title: 'Teacher Timetable',
              page: '/academics/teacher-timetable'
            },
            {
              title: 'Assign Class Teacher',
              page: '/academics/assign-class-teacher'
            },
            
            {
              title: 'Class',
              page: '/academics/class'
            },
            {
              title: 'Section',
              page: '/academics/section'
            },
            {
              title: 'Subject',
              page: '/academics/subject'
            },
            {
              title: 'Subject Group',
              page: '/academics/subject-group'
            },
            
          ]
        },
        {
          title: 'Attendance',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Student Attendance',
              page: '/attendance/student-attendance'
            },
            {
              title: 'Attendance By Date',
              page: '/attendance/attendance-by-date'
            },
            {
              title: 'Approve Leave',
              page: '/attendance/approve-leave'
            },
            
          ]
        },

        {
          title: 'HomeWork',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Homework',
              page: '/homework/homework-list'
            },
            
          ]
        },

        {
          title: 'Library',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Book List',
              page: '/library/book-list'
            },
            {
              title: 'Issue Return',
              page: '/library/library-member-list'
            },
            {
              title: 'Library Student Member',
              page: '/library/library-student-member'
            },
            {
              title: 'Library Staff Member',
              page: '/library/library-staff-member'
            },
            

            
          ]
        },

        
        {
          title: 'Human Resource',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
           
            {
              title: 'Add Staff',
              page: '/human-resource/staff'
            },
            {
              title: 'Staff Directory',
              page: '/human-resource/staff-directory'
            },
            {
              title: 'Staff Attendance',
              page: '/human-resource/staff-attendance'
            },
            {
              title: 'Apply Leave',
              page: '/human-resource/apply-leave'
            },
            {
              title: 'Approve Leave Request',
              page: '/human-resource/approve-leave-request'
            },
            
            {
              title: 'Leave Type',
              page: '/human-resource/leave-type'
            },
            {
              title: 'Department',
              page: '/human-resource/department'
            },
            {
              title: 'Designation',
              page: '/human-resource/designation'
            },
            {
              title: 'Payroll',
              page: '/human-resource/payroll'
            },
            
            {
              title: 'Disabled Staff',
              page: '/human-resource/disabled-staff'
            },
            {
              title: 'Staff Rating',
              page: '/human-resource/staff-rating'
            },

            
            
          ]
        },
        
        {
          title: 'Fees Collection',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Fees Type',
              page: '/fees-collection/fees-type'
            },
            {
              title: 'Fees Group',
              page: '/fees-collection/fees-group'
            },
            {
              title: 'Fees Discount',
              page: '/fees-collection/fees-discount'
            },
            {
              title: 'Fees Master',
              page: '/fees-collection/fees-master'
            },
            
            {
              title: 'Fees Collect',
              page: '/fees-collection/fees-collect'
            },

            {
              title: 'Search Fees Payment',
              page: '/fees-collection/search-fees-payment'
            },

            {
              title: 'Search Due Fees',
              page: '/fees-collection/search-due-fees'
            },
            {
              title: 'Fees Reminder',
              page: '/fees-collection/fees-reminder'
            },
            
          ]
        },
        

        {
          title: 'Income',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Add Income',
              page: '/income/add-income'
            },
            {
              title: 'Search Income',
              page: '/income/search-income'
            },
            {
              title: 'Income Head',
              page: '/income/income-head'
            },
            
          ]
        },

        {
          title: 'Expense',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Add Expense',
              page: '/expense/add-expense'
            },
            {
              title: 'Search Expense',
              page: '/expense/search-expense'
            },
            {
              title: 'Expense Head',
              page: '/expense/expense-head'
            },
            
          ]
        },
        

        {
          title: 'Transport',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Routes',
              page: '/transport/routes'
            },
            {
              title: 'Vehicles',
              page: '/transport/vehicles'
            },
            {
              title: 'Assign Vehicle',
              page: '/transport/assign-vehicle'
            },
            
          ]
        },
        

        {
          title: 'Hostel',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Hostel',
              page: '/hostel/hostel'
            },
            {
              title: 'Room Type',
              page: '/hostel/room-type'
            },
            {
              title: 'Hostel Room',
              page: '/hostel/hostel-room'
            },
            
          ]
        },

        {
          title: 'Inventory',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Item Category',
              page: '/inventory/item-category'
            },
            {
              title: 'Add Item',
              page: '/inventory/add-item'
            },
            {
              title: 'Item Store',
              page: '/inventory/item-store'
            },
            {
              title: 'Item Supplier',
              page: '/inventory/item-supplier'
            },
            {
              title: 'Item Stock',
              page: '/inventory/item-stock'
            },
            {
              title: 'Item Issue',
              page: '/inventory/item-issue'
            },
            
          ]
        },

        {
          title: 'Examination',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Exam Group',
              page: '/examination/exam-group'
            },
            // {
            //   title: 'Exam',
            //   page: '/examination/exam/:id'
            // },
            {
              title: 'Exam Schedule',
              page: '/examination/exam-schedule'
            },  
            {
              title: 'Exam Subject Marks',
              page: '/examination/examSubjectMarks/:examId/:examSubjectId/:examGroupId'
            },
            {
              title: 'Exam Result',
              page: '/examination/exam-result'
            },  

            
          ]
        },


        {
          title: 'Communication',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Notice Board',
              page: '/communication/notice-board'
            },
            {
              title: 'Send Email',
              page: '/communication/send-email'
            },
            {
              title: 'Send Sms',
              page: '/communication/send-sms'
            },  
            {
              title: 'Email Sms Log',
              page: '/communication/email-sms-log'
            },  

            
          ]
        },


        {
          title: 'Report',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Student Information',
              page: '/report/student-information'
            },
            {
              title: 'Finance',
              page: '/report/finance'
            },

            
            
            {
              title: 'Human Resource',
              page: '/report/human-resource-report'
            },

            {
              title: 'Library',
              page: '/report/library-report'
            },

            {
              title: 'Inventory',
              page: '/report/inventory-report'
            },

            {
              title: 'Transport',
              page: '/report/transport-report'
            },
            {
              title: 'Hostel',
              page: '/report/hostel-report'
            },
            
          ]
        },
        

        {
          title: 'System Setting',
          bullet: 'dot',
          icon: 'flaticon-interface-7',
          submenu: [
            
            {
              title: 'Roles Permissions',
              page: '/system-setting/roles'
            },
            {
              title: 'Session Setting',
              page: '/system-setting/sessions'
            },
            {
              title: 'Email Setting',
              page: '/system-setting/email_setting'
            },  
            {
              title: 'Sms Setting',
              page: '/system-setting/sms_setting'
            },
            {
              title: 'Backup Restore',
              page: '/system-setting/backup_restore'
            },  
            {
              title: 'Notification Setting',
              page: '/system-setting/notification_setting'
            },  
            {
              title: 'Users',
              page: '/system-setting/users'
            }, 
          ]
        },



        // {section: 'Components'},
        // {
        //   title: 'Google Material',
        //   root: true,
        //   bullet: 'dot',
        //   icon: 'flaticon2-browser-2',
        //   submenu: [
        //     {
        //       title: 'Form Controls',
        //       bullet: 'dot',
        //       submenu: [
        //         {
        //           title: 'Auto Complete',
        //           page: '/material/form-controls/autocomplete',
        //           permission: 'accessToECommerceModule'
        //         },
        //         {
        //           title: 'Checkbox',
        //           page: '/material/form-controls/checkbox'
        //         },
        //         {
        //           title: 'Radio Button',
        //           page: '/material/form-controls/radiobutton'
        //         },
        //         {
        //           title: 'Datepicker',
        //           page: '/material/form-controls/datepicker'
        //         },
        //         {
        //           title: 'Form Field',
        //           page: '/material/form-controls/formfield'
        //         },
        //         {
        //           title: 'Input',
        //           page: '/material/form-controls/input'
        //         },
        //         {
        //           title: 'Select',
        //           page: '/material/form-controls/select'
        //         },
        //         {
        //           title: 'Slider',
        //           page: '/material/form-controls/slider'
        //         },
        //         {
        //           title: 'Slider Toggle',
        //           page: '/material/form-controls/slidertoggle'
        //         }
        //       ]
        //     },
        //     {
        //       title: 'Navigation',
        //       bullet: 'dot',
        //       submenu: [
        //         {
        //           title: 'Menu',
        //           page: '/material/navigation/menu'
        //         },
        //         {
        //           title: 'Sidenav',
        //           page: '/material/navigation/sidenav'
        //         },
        //         {
        //           title: 'Toolbar',
        //           page: '/material/navigation/toolbar'
        //         }
        //       ]
        //     },
        //     {
        //       title: 'Layout',
        //       bullet: 'dot',
        //       submenu: [
        //         {
        //           title: 'Card',
        //           page: '/material/layout/card'
        //         },
        //         {
        //           title: 'Divider',
        //           page: '/material/layout/divider'
        //         },
        //         {
        //           title: 'Expansion panel',
        //           page: '/material/layout/expansion-panel'
        //         },
        //         {
        //           title: 'Grid list',
        //           page: '/material/layout/grid-list'
        //         },
        //         {
        //           title: 'List',
        //           page: '/material/layout/list'
        //         },
        //         {
        //           title: 'Tabs',
        //           page: '/material/layout/tabs'
        //         },
        //         {
        //           title: 'Stepper',
        //           page: '/material/layout/stepper'
        //         },
        //         {
        //           title: 'Tree',
        //           page: '/material/layout/tree'
        //         }
        //       ]
        //     },
        //     {
        //       title: 'Buttons & Indicators',
        //       bullet: 'dot',
        //       submenu: [
        //         {
        //           title: 'Button',
        //           page: '/material/buttons-and-indicators/button'
        //         },
        //         {
        //           title: 'Button toggle',
        //           page: '/material/buttons-and-indicators/button-toggle'
        //         },
        //         {
        //           title: 'Chips',
        //           page: '/material/buttons-and-indicators/chips'
        //         },
        //         {
        //           title: 'Icon',
        //           page: '/material/buttons-and-indicators/icon'
        //         },
        //         {
        //           title: 'Progress bar',
        //           page: '/material/buttons-and-indicators/progress-bar'
        //         },
        //         {
        //           title: 'Progress spinner',
        //           page: '/material/buttons-and-indicators/progress-spinner'
        //         },
        //         {
        //           title: 'Ripples',
        //           page: '/material/buttons-and-indicators/ripples'
        //         }
        //       ]
        //     },
        //     {
        //       title: 'Popups & Modals',
        //       bullet: 'dot',
        //       submenu: [
        //         {
        //           title: 'Bottom sheet',
        //           page: '/material/popups-and-modals/bottom-sheet'
        //         },
        //         {
        //           title: 'Dialog',
        //           page: '/material/popups-and-modals/dialog'
        //         },
        //         {
        //           title: 'Snackbar',
        //           page: '/material/popups-and-modals/snackbar'
        //         },
        //         {
        //           title: 'Tooltip',
        //           page: '/material/popups-and-modals/tooltip'
        //         }
        //       ]
        //     },
        //     {
        //       title: 'Data table',
        //       bullet: 'dot',
        //       submenu: [
        //         {
        //           title: 'Paginator',
        //           page: '/material/data-table/paginator'
        //         },
        //         {
        //           title: 'Sort header',
        //           page: '/material/data-table/sort-header'
        //         },
        //         {
        //           title: 'Table',
        //           page: '/material/data-table/table'
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   title: 'Ng-Bootstrap',
        //   root: true,
        //   bullet: 'dot',
        //   icon: 'flaticon2-digital-marketing',
        //   submenu: [
        //     {
        //       title: 'Accordion',
        //       page: '/ngbootstrap/accordion'
        //     },
        //     {
        //       title: 'Alert',
        //       page: '/ngbootstrap/alert'
        //     },
        //     {
        //       title: 'Buttons',
        //       page: '/ngbootstrap/buttons'
        //     },
        //     {
        //       title: 'Carousel',
        //       page: '/ngbootstrap/carousel'
        //     },
        //     {
        //       title: 'Collapse',
        //       page: '/ngbootstrap/collapse'
        //     },
        //     {
        //       title: 'Datepicker',
        //       page: '/ngbootstrap/datepicker'
        //     },
        //     {
        //       title: 'Dropdown',
        //       page: '/ngbootstrap/dropdown'
        //     },
        //     {
        //       title: 'Modal',
        //       page: '/ngbootstrap/modal'
        //     },
        //     {
        //       title: 'Pagination',
        //       page: '/ngbootstrap/pagination'
        //     },
        //     {
        //       title: 'Popover',
        //       page: '/ngbootstrap/popover'
        //     },
        //     {
        //       title: 'Progressbar',
        //       page: '/ngbootstrap/progressbar'
        //     },
        //     {
        //       title: 'Rating',
        //       page: '/ngbootstrap/rating'
        //     },
        //     {
        //       title: 'Tabs',
        //       page: '/ngbootstrap/tabs'
        //     },
        //     {
        //       title: 'Timepicker',
        //       page: '/ngbootstrap/timepicker'
        //     },
        //     {
        //       title: 'Tooltips',
        //       page: '/ngbootstrap/tooltip'
        //     },
        //     {
        //       title: 'Typehead',
        //       page: '/ngbootstrap/typehead'
        //     }
        //   ]
        // },
        // {section: 'Applications'},
        // {
        //   title: 'eCommerce',
        //   bullet: 'dot',
        //   icon: 'flaticon2-list-2',
        //   root: true,
        //   permission: 'accessToECommerceModule',
        //   submenu: [
        //     {
        //       title: 'Customers',
        //       page: '/ecommerce/customers'
        //     },
        //     {
        //       title: 'Products',
        //       page: '/ecommerce/products'
        //     },
        //   ]
        // },
        // {
        //   title: 'User Management',
        //   root: true,
        //   bullet: 'dot',
        //   icon: 'flaticon2-user-outline-symbol',
        //   submenu: [
        //     {
        //       title: 'Users',
        //       page: '/user-management/users'
        //     },
        //     {
        //       title: 'Roles',
        //       page: '/user-management/roles'
        //     }
        //   ]
        // },
        // {section: 'Custom'},
        // {
        //   title: 'Error Pages',
        //   root: true,
        //   bullet: 'dot',
        //   icon: 'flaticon2-list-2',
        //   submenu: [
        //     {
        //       title: 'Error 1',
        //       page: '/error/error-1'
        //     },
        //     {
        //       title: 'Error 2',
        //       page: '/error/error-2'
        //     },
        //     {
        //       title: 'Error 3',
        //       page: '/error/error-3'
        //     },
        //     {
        //       title: 'Error 4',
        //       page: '/error/error-4'
        //     },
        //     {
        //       title: 'Error 5',
        //       page: '/error/error-5'
        //     },
        //     {
        //       title: 'Error 6',
        //       page: '/error/error-6'
        //     },
        //   ]
        // },
        // {
        //   title: 'Wizard',
        //   root: true,
        //   bullet: 'dot',
        //   icon: 'flaticon2-mail-1',
        //   submenu: [
        //     {
        //       title: 'Wizard 1',
        //       page: '/wizard/wizard-1'
        //     },
        //     {
        //       title: 'Wizard 2',
        //       page: '/wizard/wizard-2'
        //     },
        //     {
        //       title: 'Wizard 3',
        //       page: '/wizard/wizard-3'
        //     },
        //     {
        //       title: 'Wizard 4',
        //       page: '/wizard/wizard-4'
        //     },
        //   ]
        // },
      ]
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
