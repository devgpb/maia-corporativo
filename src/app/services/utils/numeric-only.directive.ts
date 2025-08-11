import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appNumericOnly]',
    standalone: false
})
export class NumericOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]+/g, '');
    if (input.value !== cleaned) {
      input.value = cleaned;
      // Emit the event with the cleaned value if you need to update the model
      input.dispatchEvent(new Event('input'));
    }
  }
}
