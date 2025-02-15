import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardClienteComponent } from './card-cliente.component';

describe('CardClienteComponent', () => {
  let component: CardClienteComponent;
  let fixture: ComponentFixture<CardClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardClienteComponent]
    });
    fixture = TestBed.createComponent(CardClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
