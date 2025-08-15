import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagensPadraoComponent } from './mensagens-padrao.component';

describe('MensagensPadraoComponent', () => {
  let component: MensagensPadraoComponent;
  let fixture: ComponentFixture<MensagensPadraoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensagensPadraoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensagensPadraoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
