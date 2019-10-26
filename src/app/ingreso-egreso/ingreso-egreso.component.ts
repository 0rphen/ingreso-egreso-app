import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ActivarLoadingActions, DesactivarLoadingActions } from '../shared/ui.actions';

@Component({
    selector: 'app-ingreso-egreso',
    templateUrl: './ingreso-egreso.component.html',
    styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit {
    forma: FormGroup;
    tipo = 'ingreso';
    loadingSubs: Subscription = new Subscription();
    cargando: boolean;

    constructor(public ingresoEgresoService: IngresoEgresoService,
        private store: Store<AppState>) { }

    ngOnInit() {
        this.loadingSubs = this.store.select('ui').subscribe(ui => {
            this.cargando = ui.isLoading;
        });
        this.forma = new FormGroup({
            'description': new FormControl('', Validators.required),
            'monto': new FormControl(0, Validators.min(0)),
        });
    }

    ngOnDestroy() {
        this.loadingSubs.unsubscribe();
    }

    crearIngresoEgreso() {
        this.store.dispatch(new ActivarLoadingActions());
        const ingresoEgreso = new IngresoEgreso({ ... this.forma.value, tipo: this.tipo });
        this.ingresoEgresoService.CrearIngresoEgreso(ingresoEgreso)
            .then(() => {
                Swal.fire('Creado', ingresoEgreso.description, 'success');
                this.forma.reset({ monto: 0 });
                this.store.dispatch(new DesactivarLoadingActions());
            });

    }

}
