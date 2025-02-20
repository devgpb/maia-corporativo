import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContatosComponent } from './lista-contatos.component';

describe('ListaContatosComponent', () => {
  let component: ListaContatosComponent;
  let fixture: ComponentFixture<ListaContatosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaContatosComponent]
    });
    fixture = TestBed.createComponent(ListaContatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
