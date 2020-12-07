// NGRX
import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer, State } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../../environments/environment';

// tslint:disable-next-line:no-empty-interface
export interface AppState { }

export const reducers: ActionReducerMap<AppState> = { router: routerReducer };

export const metaReducers: Array<MetaReducer<AppState>> = !environment.production ? [storeFreeze] : [storeFreeze];


export function createMetaReducers(freeze = false): MetaReducer<AppState>[] {
    return freeze
        ? [storeFreeze] 
        : [];
}

// import { compose } from "@ngrx/core";
 
// const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
// const productionReducer: ActionReducer<AppState> = combineReducers(reducers);
 
// export function AppReducer(state: any, action: any) {
//     if (environment.enableStoreFreeze && !environment.production)
//         return developmentReducer(state, action);
//     else
//         return productionReducer(state, action);
// }