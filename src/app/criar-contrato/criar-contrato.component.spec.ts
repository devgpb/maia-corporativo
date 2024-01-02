import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarContratoComponent } from './criar-contrato.component';

describe('CriarContratoComponent', () => {
  let component: CriarContratoComponent;
  let fixture: ComponentFixture<CriarContratoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarContratoComponent]
    });
    fixture = TestBed.createComponent(CriarContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
