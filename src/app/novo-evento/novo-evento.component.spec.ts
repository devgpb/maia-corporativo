import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoEventoComponent } from './novo-evento.component';

describe('NovoEventoComponent', () => {
  let component: NovoEventoComponent;
  let fixture: ComponentFixture<NovoEventoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovoEventoComponent]
    });
    fixture = TestBed.createComponent(NovoEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
