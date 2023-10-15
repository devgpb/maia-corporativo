import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusRelatoriosComponent } from './meus-relatorios.component';

describe('MeusRelatoriosComponent', () => {
  let component: MeusRelatoriosComponent;
  let fixture: ComponentFixture<MeusRelatoriosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeusRelatoriosComponent]
    });
    fixture = TestBed.createComponent(MeusRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
