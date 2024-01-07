import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimencionarProjetoComponent } from './dimencionar-projeto.component';

describe('DimencionarProjetoComponent', () => {
  let component: DimencionarProjetoComponent;
  let fixture: ComponentFixture<DimencionarProjetoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DimencionarProjetoComponent]
    });
    fixture = TestBed.createComponent(DimencionarProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
