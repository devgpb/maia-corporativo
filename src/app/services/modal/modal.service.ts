import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() {}

  // Inicialize com um valor falso, supondo que o modal esteja escondido inicialmente
  private modalVisibility = new BehaviorSubject<boolean>(false);
  modalVisibility$ = this.modalVisibility.asObservable();

  show() {
    this.modalVisibility.next(true);
  }

  hide() {
    this.modalVisibility.next(false);
  }

  toggle() {
    // Pega o valor atual e inverte-o
    this.modalVisibility.next(!this.modalVisibility.value);
  }
}
