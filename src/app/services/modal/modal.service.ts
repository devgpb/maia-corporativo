import { Injectable, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {


  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
  }

  private modalVisibility = new Subject<boolean>();
  modalVisibility$ = this.modalVisibility.asObservable();

  show() {
    this.modalVisibility.next(true);
  }

  hide() {
    this.modalVisibility.next(false);
  }
}
