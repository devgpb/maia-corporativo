import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstalarComponent } from './instalar.component';

describe('InstalarComponent', () => {
  let component: InstalarComponent;
  let fixture: ComponentFixture<InstalarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstalarComponent]
    });
    fixture = TestBed.createComponent(InstalarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
