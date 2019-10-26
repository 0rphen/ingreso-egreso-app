import { Action } from '@ngrx/store';
import { User } from './user.model';

export const SET_USER = '[Auth] set User';
export const UNSET_USER = '[Auth] unset User';

export class SetUserActions implements Action {
    readonly type = SET_USER;

    constructor(public user: User) { }
}

export class UnsetUserActions implements Action {
    readonly type = UNSET_USER;
}

export type acciones = SetUserActions | UnsetUserActions;
