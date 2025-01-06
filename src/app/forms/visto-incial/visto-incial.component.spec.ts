import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistoIncialComponent } from './visto-incial.component';

describe('VistoIncialComponent', () => {
  let component: VistoIncialComponent;
  let fixture: ComponentFixture<VistoIncialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistoIncialComponent]
    });
    fixture = TestBed.createComponent(VistoIncialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
