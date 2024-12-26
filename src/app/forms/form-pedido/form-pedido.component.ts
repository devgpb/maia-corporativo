import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrls: ['./form-pedido.component.scss']
})
export class FormPedidoComponent implements OnInit {

  public componentShow: any = null;

  ngOnInit() {
    // Obter o caminho da URL (sem o domínio)
    const urlPath = new URL(window.location.href).pathname;

    console.log('URL completa:', window.location.href);
    console.log('Caminho da URL:', urlPath);

    // Verificar o caminho e configurar o componente
    if (urlPath === '/pedido/criar/externo') {
      this.componentShow = {
        id: "PedidoFechado",
        titulo: "Formulário de Fechamento de Pedido"
      };
    } else if(urlPath === '/pedido/finalizar/externo'){
      this.componentShow = {
        id: "FinalizarPedido",
        titulo: "Formulário de Finalização de Instalação"
      };
    }
  }

  abrirCompartilharForm() {
    const linkAtual = window.location.href; // Obter o link completo atual

    Swal.fire({
      title: 'Compartilhar Formulário',
      html: `
        <p style="margin-bottom: 10px;">Link de compartilhamento:</p>
        <input id="linkCompartilhamento" class="swal2-input" style="width: 90%; margin: auto;" value="${linkAtual}" readonly>
      `,
      showCancelButton: true,
      confirmButtonText: '<span style="padding: 5px 10px;">Copiar Link</span>',
      cancelButtonText: 'Fechar',
      customClass: {
        confirmButton: 'btn-custom-confirm',
        cancelButton: 'btn-custom-cancel',
      },
      didOpen: () => {
        const input = document.getElementById('linkCompartilhamento') as HTMLInputElement;
        if (input) {
          input.select(); // Selecionar o texto do link
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.copiarParaAreaDeTransferencia(linkAtual);
        Swal.fire('Link Copiado!', 'O link foi copiado para a área de transferência.', 'success');
      }
    });
  }

  copiarParaAreaDeTransferencia(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      console.log('Texto copiado para a área de transferência:', texto);
    }).catch((err) => {
      console.error('Erro ao copiar texto:', err);
    });
  }
}
