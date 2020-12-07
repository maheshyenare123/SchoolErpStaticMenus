// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ComplaintTypeModel } from '../_models/complaint-type.model';


export enum ComplaintTypeActionTypes {
  ComplaintTypeOnServerCreated = '[Edit ComplaintType Dialog] ComplaintType On Server Created',
  ComplaintTypeCreated = '[Edit ComplaintType Dialog] ComplaintType Created',
  ComplaintTypeUpdated = '[Edit ComplaintType Dialog] ComplaintType Updated',
  ComplaintTypesStatusUpdated = '[ComplaintType List Page] ComplaintTypes Status Updated',
  OneComplaintTypeDeleted = '[ComplaintTypes List Page] One ComplaintType Deleted',
  ManyComplaintTypesDeleted = '[ComplaintTypes List Page] Many ComplaintType Deleted',
  ComplaintTypesPageRequested = '[ComplaintTypes List Page] ComplaintTypes Page Requested',
  ComplaintTypesPageLoaded = '[ComplaintTypes API] ComplaintTypes Page Loaded',
  ComplaintTypesPageCancelled = '[ComplaintTypes API] ComplaintTypes Page Cancelled',
  ComplaintTypesPageToggleLoading = '[ComplaintTypes] ComplaintTypes Page Toggle Loading',
  ComplaintTypeActionToggleLoading = '[ComplaintTypes] ComplaintTypes Action Toggle Loading',
  ComplaintTypeStoreUpdated = '[Edit ComplaintType Dialog] ComplaintType Updated | Only on storage',
}

export class ComplaintTypeOnServerCreated implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypeOnServerCreated;
  constructor(public payload: { complaintType: ComplaintTypeModel }) {
  }
}

export class ComplaintTypeCreated implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypeCreated;

  constructor(public payload: { complaintType: ComplaintTypeModel }) {
  }
}

export class ComplaintTypeUpdated implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypeUpdated;

  constructor(public payload: {
    partialComplaintType: Update<ComplaintTypeModel>, // For State update
    complaintType: ComplaintTypeModel // For Server update (through service)
  }) {
  }
}

export class ComplaintTypesStatusUpdated implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypesStatusUpdated;

  constructor(public payload: {
    complaintTypes: ComplaintTypeModel[],
    status: number
  }) {
  }
}

export class OneComplaintTypeDeleted implements Action {
  readonly type = ComplaintTypeActionTypes.OneComplaintTypeDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyComplaintTypesDeleted implements Action {
  readonly type = ComplaintTypeActionTypes.ManyComplaintTypesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ComplaintTypesPageRequested implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ComplaintTypesPageLoaded implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypesPageLoaded;

  constructor(public payload: { complaintTypes: ComplaintTypeModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ComplaintTypesPageCancelled implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypesPageCancelled;
}

export class ComplaintTypesPageToggleLoading implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ComplaintTypeActionToggleLoading implements Action {
  readonly type = ComplaintTypeActionTypes.ComplaintTypeActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }

}
  export class ComplaintTypeStoreUpdated implements Action {
    readonly type = ComplaintTypeActionTypes.ComplaintTypeStoreUpdated;
  
    constructor(public payload: {
      complainType: Update<ComplaintTypeModel>, // For State update
    }) {
    
    }
}



export type ComplaintTypeActions = ComplaintTypeOnServerCreated
| ComplaintTypeCreated
| ComplaintTypeUpdated
| ComplaintTypesStatusUpdated
| OneComplaintTypeDeleted
| ManyComplaintTypesDeleted
| ComplaintTypesPageRequested
| ComplaintTypesPageLoaded
| ComplaintTypesPageCancelled
| ComplaintTypesPageToggleLoading
| ComplaintTypeActionToggleLoading
| ComplaintTypeStoreUpdated;
