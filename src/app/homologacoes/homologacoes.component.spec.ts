import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologacoesComponent } from './homologacoes.component';

describe('HomologacoesComponent', () => {
  let component: HomologacoesComponent;
  let fixture: ComponentFixture<HomologacoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomologacoesComponent]
    });
    fixture = TestBed.createComponent(HomologacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
