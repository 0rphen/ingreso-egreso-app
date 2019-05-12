import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingActions, DesactivarLoadingActions } from '../shared/ui.actions';
import { SetUserActions } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userSubscribtion: Subscription = new Subscription();

    constructor(private afAuth: AngularFireAuth,
        private router: Router,
        private angularFireDb: AngularFirestore,
        private store: Store<AppState>) {

    }

    initAuthListener() {
        this.afAuth.authState.subscribe((fbUser: firebase.User) => {
            if (fbUser) {
                this.userSubscribtion = this.angularFireDb.doc(`${fbUser.uid}/usuario`).valueChanges()
                    .subscribe((usuarioObj: any) => {
                        const newUser = new User(usuarioObj);
                        this.store.dispatch(new SetUserActions(newUser))
                    });
            } else {
                this.userSubscribtion.unsubscribe();
            }
        });
    }

    crearUsuario(nombre: string, email: string, password: string) {
        this.store.dispatch(new ActivarLoadingActions());
        this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(resp => {
                const user: User = {
                    uid: resp.user.uid,
                    nombre: nombre,
                    email: resp.user.email
                };
                this.angularFireDb.doc(`${user.uid}/usuario`)
                    .set(user).then(() => {
                        this.router.navigate(['/']);
                        this.store.dispatch(new DesactivarLoadingActions());
                    })
            })
            .catch(err => {
                Swal.fire('Error en el login', err.message, 'error');
                this.store.dispatch(new DesactivarLoadingActions());
            });
    }

    login(email: string, password: string) {
        this.store.dispatch(new ActivarLoadingActions());
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(resp => {
                this.router.navigate(['/']);
                this.store.dispatch(new DesactivarLoadingActions());
            })
            .catch(err => {
                Swal.fire('Error en el login', err.message, 'error');
                this.store.dispatch(new DesactivarLoadingActions());
            });
    }

    logout() {
        this.router.navigate(['/login']);
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.afAuth.authState.pipe(
            map(fbUser => {
                if (fbUser == null)
                    this.router.navigate(['/login']);
                return fbUser != null;
            })
        );
    }
}
