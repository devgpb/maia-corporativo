import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitsSolaresComponent } from './kits-solares.component';

describe('KitsSolaresComponent', () => {
  let component: KitsSolaresComponent;
  let fixture: ComponentFixture<KitsSolaresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KitsSolaresComponent]
    });
    fixture = TestBed.createComponent(KitsSolaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
