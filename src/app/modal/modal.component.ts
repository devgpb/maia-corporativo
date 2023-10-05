import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ModalService } from '../services/modal/modal.service';
import { Subscription } from 'rxjs';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnDestroy {
  mostrar: boolean = false;
  private subscription: Subscription;

  constructor(private modalService: ModalService) {
    this.subscription = this.modalService.modalVisibility$.subscribe(visible => {
      this.mostrar = visible;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggle() {
    this.mostrar = !this.mostrar;
  }
}
