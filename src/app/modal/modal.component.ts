import { Component, OnDestroy } from '@angular/core';
import { ModalService } from '../services/modal/modal.service';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 })),
      ])
    ])
  ]
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close() {
    this.modalService.hide();
  }
}
