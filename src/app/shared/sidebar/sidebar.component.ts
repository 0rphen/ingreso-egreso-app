import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/ingreso-egreso/ingreso-egreso.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
    nombre: string;
    subscription: Subscription = new Subscription();

    constructor(public authService: AuthService,
        public ingresoEgresoService: IngresoEgresoService,
        private store: Store<AppState>) { }

    ngOnInit() {
        this.subscription = this.store.select('auth')
            .pipe(filter(auth => auth.user != null))
            .subscribe(auth => this.nombre = auth.user.nombre)
    }

    logout() {
        this.authService.logout();
        this.ingresoEgresoService.CancelarSubscriptions();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
