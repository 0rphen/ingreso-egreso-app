export class IngresoEgreso {
    description: string;
    monto: number;
    tipo: string;
    uid?: string;

    constructor(obj: DataObj) {
        this.description = obj && obj.description || null;
        this.monto = obj && obj.monto || null;
        this.tipo = obj && obj.tipo || null;
    }
}

interface DataObj {
    description: string;
    monto: number;
    tipo: string;
    uid: string;
}
