import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPedidosComponent } from './display-pedidos.component';

describe('DisplayPedidosComponent', () => {
  let component: DisplayPedidosComponent;
  let fixture: ComponentFixture<DisplayPedidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPedidosComponent]
    });
    fixture = TestBed.createComponent(DisplayPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
