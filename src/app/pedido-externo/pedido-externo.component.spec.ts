import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoExternoComponent } from './pedido-externo.component';

describe('PedidoExternoComponent', () => {
  let component: PedidoExternoComponent;
  let fixture: ComponentFixture<PedidoExternoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PedidoExternoComponent]
    });
    fixture = TestBed.createComponent(PedidoExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
