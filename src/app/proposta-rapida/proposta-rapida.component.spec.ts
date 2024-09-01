import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropostaRapidaComponent } from './proposta-rapida.component';

describe('PropostaRapidaComponent', () => {
  let component: PropostaRapidaComponent;
  let fixture: ComponentFixture<PropostaRapidaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropostaRapidaComponent]
    });
    fixture = TestBed.createComponent(PropostaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
