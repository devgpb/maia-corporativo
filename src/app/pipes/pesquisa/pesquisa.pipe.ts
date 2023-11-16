import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesquisa'
})
export class PesquisaPipe implements PipeTransform {

  transform(items: any[], searchText: string, page: number, itemsPerPage: number): any[] {
    // Primeiro, aplicamos a pesquisa
    let filteredItems = items;
    if (searchText) {
      searchText = searchText.toLowerCase();
      filteredItems = items.filter(item => {
        return Object.values(item).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(searchText)
        );
      });
    }

    // Em seguida, aplicamos a paginação
    const startIndex = (page - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }

}
