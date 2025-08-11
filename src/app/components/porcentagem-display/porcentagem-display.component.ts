import { Component, Input } from '@angular/core';

@Component({
    selector: 'porcentagem-display',
    templateUrl: './porcentagem-display.component.html',
    styleUrls: ['./porcentagem-display.component.scss'],
    standalone: false
})
export class PorcentagemDisplayComponent {

  @Input() label: string;
  @Input() title: string;
  @Input() value: number;

  calcularDashOffset(): number {
    return 565 - (565 * this.value) / 100;
  }
}
