import { TestBed } from '@angular/core/testing';

import { IngresoEgresoService } from './ingreso-egreso.service';

describe('IngresoEgresoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IngresoEgresoService = TestBed.get(IngresoEgresoService);
    expect(service).toBeTruthy();
  });
});
