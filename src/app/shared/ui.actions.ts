import { Action } from '@ngrx/store';

export const ACTIVAR_LOADING = '[UI Loading] Cargando ...';
export const DESACTIVAR_LOADING = '[UI Loading] Fin de carga...';

export class ActivarLoadingActions implements Action {
    readonly type = ACTIVAR_LOADING;
}

export class DesactivarLoadingActions implements Action {
    readonly type = DESACTIVAR_LOADING;
}

export type acciones = ActivarLoadingActions | DesactivarLoadingActions;
