import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer'
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';

import Swal from 'sweetalert2';

@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

    items: IngresoEgreso[];
    subscription: Subscription = new Subscription();

    constructor(private store: Store<fromIngresoEgreso.AppState>, public ingresoEgresoService: IngresoEgresoService) { }

    ngOnInit() {
        this.subscription = this.store.select('ingresoEgreso').subscribe(ingresoEgreso => this.items = ingresoEgreso.items)
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    borrarItem(item: IngresoEgreso) {
        this.ingresoEgresoService.BorrarIngresoEgreso(item.uid)
            .then(() => Swal.fire('Eliminado', item.description, 'success'))
    }
}
