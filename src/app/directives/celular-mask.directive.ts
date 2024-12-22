import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCelularMask]'
})
export class CelularMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = this.el.nativeElement.value;
    value = value.replace(/\D/g, ''); // Remove tudo o que não for dígito
    value = value.substring(0, 11); // Limita a 11 dígitos
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // Parênteses nos dois primeiros dígitos
    value = value.replace(/(\d)(\d{4})$/, '$1-$2'); // Hífen no meio
    this.el.nativeElement.value = value;
  }
}
