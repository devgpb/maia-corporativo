import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  implements OnInit {
  list = [
    {
      idPedido: 3,
      nomeCompleto: "4 User",
      consumoDeEnergiaMensal: 100.5,
      celular: "(11) 98765-4321",
      cidade: "São Paulo",
      cep: "01000-000",
      rua: "Rua Exemplo",
      email: "demo@example.com",
      referencia: "2",
      dataPedido: new Date("2023-10-03T18:10:12.234Z")
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  formatarData(data: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  };
  return data.toLocaleDateString('pt-BR', options);
  }

}
