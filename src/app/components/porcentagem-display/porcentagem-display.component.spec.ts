import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorcentagemDisplayComponent } from './porcentagem-display.component';

describe('PorcentagemDisplayComponent', () => {
  let component: PorcentagemDisplayComponent;
  let fixture: ComponentFixture<PorcentagemDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PorcentagemDisplayComponent]
    });
    fixture = TestBed.createComponent(PorcentagemDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
