import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioCorporativoComponent } from './calendario-corporativo.component';

describe('CalendarioCorporativoComponent', () => {
  let component: CalendarioCorporativoComponent;
  let fixture: ComponentFixture<CalendarioCorporativoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioCorporativoComponent]
    });
    fixture = TestBed.createComponent(CalendarioCorporativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
