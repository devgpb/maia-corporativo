import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoMenuComponent } from './novo-menu.component';

describe('NovoMenuComponent', () => {
  let component: NovoMenuComponent;
  let fixture: ComponentFixture<NovoMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovoMenuComponent]
    });
    fixture = TestBed.createComponent(NovoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
