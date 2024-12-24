import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPedidoComponent } from './form-pedido.component';

describe('FormPedidoComponent', () => {
  let component: FormPedidoComponent;
  let fixture: ComponentFixture<FormPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPedidoComponent]
    });
    fixture = TestBed.createComponent(FormPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
