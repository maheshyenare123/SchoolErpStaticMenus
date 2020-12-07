
//models

export {ExamModel} from './_models/exam.model';
export {HostelRoomModel} from './_models/hostel-room.model';
export {ExamGroupModel} from './_models/exam-group.model';
export {ExamSubjectModel} from './_models/exam-subject.model';
export {ExamSubjectMarksModel} from './_models/exam-subject-marks.model';

//datasource

export {ExamsDataSource} from './_data-sources/exam.datasource';
export {HostelRoomsDataSource} from './_data-sources/hosel-room.datasource';
export {ExamGroupsDataSource} from './_data-sources/exam-group.datasource';
export {AssignStudentExamsDataSource} from './_data-sources/assign-student-exam.datasource';
export {ExamSubjectsDataSource} from './_data-sources/exam-subject.datasource';
export {ExamSubjectMarkssDataSource} from './_data-sources/exam-subject-marks.datasource';

// Effects

export { ExamEffects } from './_effects/exam.effects';
export { HostelRoomEffects } from './_effects/hostel-room.effects';
export { ExamGroupEffects } from './_effects/exam-group.effects';
export { AssignStudentExamEffects } from './_effects/assign-student-exam.effects';
export { ExamSubjectEffects } from './_effects/exam-subject.effects';
export { ExamSubjectMarksEffects } from './_effects/exam-subject-marks.effects';
// Actions
// Customer Actions =>

export {
    ExamActionToggleLoading,
    ExamActionTypes,
    ExamActions,
    ExamCreated,
    ExamOnServerCreated,
    ExamUpdated,
    ExamsPageCancelled,
    ExamsPageLoaded,
    ExamsPageRequested,
    ExamsPageToggleLoading,
    ExamsStatusUpdated,
     ManyExamsDeleted,
     OneExamDeleted
 } from './_actions/exam.actions';
 export {
 HostelRoomActionToggleLoading,
 HostelRoomActionTypes,
 HostelRoomActions,
 HostelRoomCreated,
 HostelRoomOnServerCreated,
 HostelRoomUpdated,
 HostelRoomsPageCancelled,
 HostelRoomsPageLoaded,
 HostelRoomsPageRequested,
 HostelRoomsPageToggleLoading,
 HostelRoomsStatusUpdated,
  ManyHostelRoomsDeleted,
  OneHostelRoomDeleted
} from './_actions/hostel-room.actions';
export {
ExamGroupActionToggleLoading,
ExamGroupActionTypes,
ExamGroupActions,
ExamGroupCreated,
ExamGroupOnServerCreated,
ExamGroupUpdated,
ExamGroupsPageCancelled,
ExamGroupsPageLoaded,
ExamGroupsPageRequested,
ExamGroupsPageToggleLoading,
ExamGroupsStatusUpdated,
 ManyExamGroupsDeleted,
 OneExamGroupDeleted
} from './_actions/exam-group.actions';
export {
    ExamSubjectMarksActionToggleLoading,
    ExamSubjectMarksActionTypes,
    ExamSubjectMarksActions,
    ExamSubjectMarksCreated,
    ExamSubjectMarksOnServerCreated,
    ExamSubjectMarksUpdated,
    ExamSubjectMarkssPageCancelled,
    ExamSubjectMarkssPageLoaded,
    ExamSubjectMarkssPageRequested,
    ExamSubjectMarkssPageToggleLoading,
    ExamSubjectMarkssStatusUpdated,
     ManyExamSubjectMarkssDeleted,
     OneExamSubjectMarksDeleted
    } from './_actions/exam-subject-marks.actions';
export {
    AssignStudentExamActionToggleLoading,
    AssignStudentExamActionTypes,
    AssignStudentExamActions,
    AssignStudentExamCreated,
    AssignStudentExamOnServerCreated,
    AssignStudentExamUpdated,
    AssignStudentExamsPageCancelled,
    AssignStudentExamsPageLoaded,
    AssignStudentExamsPageRequested,
    AssignStudentExamsPageToggleLoading,
    AssignStudentExamsStatusUpdated,
    ManyAssignStudentExamsDeleted,
    OneAssignStudentExamDeleted
} from './_actions/assign-student-exam.actions';
export {
    ExamSubjectActionToggleLoading,
    ExamSubjectActionTypes,
    ExamSubjectActions,
    ExamSubjectCreated,
    ExamSubjectOnServerCreated,
    ExamSubjectUpdated,
    ExamSubjectsPageCancelled,
    ExamSubjectsPageLoaded,
    ExamSubjectsPageRequested,
    ExamSubjectsPageToggleLoading,
    ExamSubjectsStatusUpdated,
    ManyExamSubjectsDeleted,
    OneExamSubjectDeleted
} from './_actions/exam-subject.actions';

// Reducers

export {examsReducer } from './_reducers/exam.reducers';
export {hostelRoomsReducer } from './_reducers/hostel-room.reducers';
export {examGroupsReducer } from './_reducers/exam-group.reducers';
export { assignStudentExamsReducer } from './_reducers/assign-student-exam.reducers';
export { examSubjectsReducer } from './_reducers/exam-subject.reducers';
export {examSubjectMarkssReducer } from './_reducers/exam-subject-marks.reducers';

// Selectors

export {
    selectExamById,
    selectExamsActionLoading,
    selectExamsInStore,
    selectExamsPageLoading,
    selectExamsShowInitWaitingMessage,
    selectExamsState,
    selectLastCreatedExamId
} from './_selectors/exam.selectors';

export {
    selectHostelRoomById,
    selectHostelRoomsActionLoading,
    selectHostelRoomsInStore,
    selectHostelRoomsPageLoading,
    selectHostelRoomsShowInitWaitingMessage,
    selectHostelRoomsState,
    selectLastCreatedHostelRoomId
} from './_selectors/hostel-room.selectors';

export {
    selectExamGroupById,
    selectExamGroupsActionLoading,
    selectExamGroupsInStore,
    selectExamGroupsPageLoading,
    selectExamGroupsShowInitWaitingMessage,
    selectExamGroupsState,
    selectLastCreatedExamGroupId
} from './_selectors/exam-group.selectors';

export {
    selectExamSubjectMarksById,
    selectExamSubjectMarkssActionLoading,
    selectExamSubjectMarkssInStore,
    selectExamSubjectMarkssPageLoading,
    selectExamSubjectMarkssShowInitWaitingMessage,
    selectExamSubjectMarkssState,
    selectLastCreatedExamSubjectMarksId
} from './_selectors/exam-subject-marks.selectors';
export {
    selectAssignStudentExamById,
    selectAssignStudentExamActionLoading,
    selectAssignStudentExamInStore,
    selectAssignStudentExamPageLoading,
    selectAssignStudentExamShowInitWaitingMessage,
    selectAssignStudentExamState,
    selectLastCreatedAssignStudentExamId
} from './_selectors/assign-student-exam.selectors';
export {
    selectExamSubjectById,
    selectExamSubjectActionLoading,
    selectExamSubjectInStore,
    selectExamSubjectPageLoading,
    selectExamSubjectShowInitWaitingMessage,
    selectExamSubjectState,
    selectLastCreatedExamSubjectId
} from './_selectors/exam-subject.selectors';


// Services

export {ExamService } from './_services/exam.service';
export {HostelRoomService } from './_services/hostel-room.service';
export {ExamGroupService } from './_services/exam-group.service';
export { AssignStudentExamService } from './_services/assign-student-exam.service';
export { ExamSubjectService } from './_services/exam-subject.service';
export {ExamSubjectMarksService } from './_services/exam-subject-marks.service';