import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private afAuth: AngularFireAuth,
        private router: Router,
        private angularFireDb: AngularFirestore) {

    }

    initAuthListener() {
        this.afAuth.authState.subscribe((fbUser: firebase.User) => {
            console.log(fbUser);
        });
    }

    crearUsuario(nombre: string, email: string, password: string) {
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
                    })
            })
            .catch(err => Swal.fire('Error en el login', err.message, 'error'));
    }

    login(email: string, password: string) {
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(resp => this.router.navigate(['/']))
            .catch(err => Swal.fire('Error en el login', err.message, 'error'));
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
