import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenciasComponent } from './referencias.component';

describe('ReferenciasComponent', () => {
  let component: ReferenciasComponent;
  let fixture: ComponentFixture<ReferenciasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReferenciasComponent]
    });
    fixture = TestBed.createComponent(ReferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
