import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFinalPedidoComponent } from './form-final-pedido.component';

describe('FormFinalPedidoComponent', () => {
  let component: FormFinalPedidoComponent;
  let fixture: ComponentFixture<FormFinalPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFinalPedidoComponent]
    });
    fixture = TestBed.createComponent(FormFinalPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
