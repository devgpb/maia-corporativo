import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizadosComponent } from './finalizados.component';

describe('FinalizadosComponent', () => {
  let component: FinalizadosComponent;
  let fixture: ComponentFixture<FinalizadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalizadosComponent]
    });
    fixture = TestBed.createComponent(FinalizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
