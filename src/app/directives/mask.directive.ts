import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appMask]'
})
export class MaskDirective {
  @Input('appMask') maskType!: string;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = this.el.nativeElement.value;

    switch (this.maskType) {
      case 'celular':
        value = value.replace(/\D/g, '');
        value = value.substring(0, 11);
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        break;

      case 'cpf':
        value = value.replace(/\D/g, '');
        value = value.substring(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        break;

      case 'cep':
        value = value.replace(/\D/g, '');
        value = value.substring(0, 8);
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        break;

      case 'cnpj':
        value = value.replace(/\D/g, '');
        value = value.substring(0, 14);
        value = value.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1/$2');
        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        break;
      case 'inteiro':
        value = value.replace(/\D/g, '');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        break;

      case 'decimal':
        value = value.replace(/\D/g, ''); // Remove tudo que não for dígito
        value = value.replace(/(\d)(\d{2})$/, '$1,$2'); // Adiciona vírgula para separar os centavos
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Adiciona pontos como separador de milhar
        break;
      case 'nome':
        value = value.replace(/\d/g, '');
        break;
    }

    this.el.nativeElement.value = value;
  }
}
