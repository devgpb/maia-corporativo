import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarProcuracaoComponent } from './criar-procuracao.component';

describe('CriarProcuracaoComponent', () => {
  let component: CriarProcuracaoComponent;
  let fixture: ComponentFixture<CriarProcuracaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarProcuracaoComponent]
    });
    fixture = TestBed.createComponent(CriarProcuracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
