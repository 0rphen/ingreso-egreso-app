import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Label, MultiDataSet } from 'ng2-charts';

@Component({
    selector: 'app-estadistica',
    templateUrl: './estadistica.component.html',
    styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit {
    ingresos: number;
    egresos: number;
    countIngresos: number;
    countEgresos: number;
    subscription: Subscription = new Subscription();
    doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
    doughnutChartData: MultiDataSet = [];

    constructor(private store: Store<AppState>) { }

    ngOnInit() {
        this.subscription = this.store.select('ingresoEgreso').subscribe(ingresoEgreso => {
            this.contarIngresoEgreso(ingresoEgreso.items);
        });
    }

    contarIngresoEgreso(items: IngresoEgreso[]) {
        this.ingresos = 0;
        this.egresos = 0;
        this.countIngresos = 0;
        this.countEgresos = 0;
        items.forEach(item => {
            if (item.tipo == 'ingreso') {
                this.countIngresos++;
                this.ingresos += item.monto;
            } else {
                this.countEgresos++;
                this.egresos += item.monto;
            }
        });
        this.doughnutChartData = [[this.ingresos], [this.egresos]];
    }
}
