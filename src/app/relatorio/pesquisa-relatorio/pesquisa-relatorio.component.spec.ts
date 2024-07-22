import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaRelatorioComponent } from './pesquisa-relatorio.component';

describe('PesquisaRelatorioComponent', () => {
  let component: PesquisaRelatorioComponent;
  let fixture: ComponentFixture<PesquisaRelatorioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PesquisaRelatorioComponent]
    });
    fixture = TestBed.createComponent(PesquisaRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
