import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
    ],
    standalone: false
})
export class ModalComponent implements OnDestroy, OnInit {
  mostrar: boolean = false;
  private subscription: Subscription;
  private escListener: () => void;

  constructor(
    private modalService: ModalService,
    private renderer: Renderer2
  ) {
    this.subscription = this.modalService.modalVisibility$.subscribe(visible => {
      this.mostrar = visible;
    });
  }

  ngOnInit(): void {
    this.escListener = this.renderer.listen('document', 'keyup', (event: KeyboardEvent) => {
      if ((event.key === 'Escape' || event.key === 'Esc') && this.mostrar) {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.escListener) {
      this.escListener();
    }
  }

  close() {
    this.modalService.hide();
  }
}
