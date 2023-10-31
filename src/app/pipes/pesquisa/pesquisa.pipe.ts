import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesquisa'
})
export class PesquisaPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      return Object.values(item).some(val => {
        // Asseguramos que val é uma string ou um número antes de chamar toString()
        if (typeof val === 'string' || typeof val === 'number') {
          return val.toString().toLowerCase().includes(searchText);
        }
        return false;
      });
    });
  }

}
