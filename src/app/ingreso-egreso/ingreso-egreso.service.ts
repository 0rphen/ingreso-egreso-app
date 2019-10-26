import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IngresoEgresoService {

    ingresoEgresoListenerSubs: Subscription = new Subscription();
    ingresoEgresoItemsSubs: Subscription = new Subscription();

    constructor(private afDB: AngularFirestore,
        public authService: AuthService,
        private store: Store<AppState>) { }

    CrearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
        const user = this.authService.getUsuario();
        return this.afDB.doc(`${user.uid}/ingresos-egresos`)
            .collection('items').add({ ...ingresoEgreso });
    }

    BorrarIngresoEgreso(uid: string) {
        const user = this.authService.getUsuario();
        return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete();
    }

    CancelarSubscriptions() {
        this.ingresoEgresoListenerSubs.unsubscribe();
        this.ingresoEgresoItemsSubs.unsubscribe();
    }

    InitIngresoEgresoListener() {
        this.ingresoEgresoListenerSubs = this.store.select('auth')
            .pipe(filter(auth => auth.user != null))
            .subscribe(auth => this.IngresoEgresoItems(auth.user.uid));
    }

    private IngresoEgresoItems(uid: string) {
        this.ingresoEgresoItemsSubs = this.afDB.collection(`${uid}/ingresos-egresos/items`)
            .snapshotChanges()
            .pipe(map(docData => {
                return docData.map(doc => {
                    return {
                        uid: doc.payload.doc.id,
                        ...doc.payload.doc.data()
                    };
                });
            }))
            .subscribe((colData: any) => {
                this.store.dispatch(new SetItemsAction(colData));
            });
    }
}
