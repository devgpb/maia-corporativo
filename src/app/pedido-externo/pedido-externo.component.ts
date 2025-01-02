import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos/pedidos.service';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms'; // Import do Reactive Forms (se ainda não tiver)
import { EquipamentosService } from '../services/equipamentos/equipamento.service';
import { mapaEquipamentos, tiposSuportes } from '../constants';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido-externo',
  templateUrl: './pedido-externo.component.html',
  styleUrls: ['./pedido-externo.component.scss']
})
export class PedidoExternoComponent implements OnInit {

  detalhes: any;
  user: any;         // Dados do usuário logado
  userCargo: string; // Cargo do usuário logado
  isEditing: boolean = false;    // Controla se está em modo de edição
  canEdit: boolean = false;      // Controla se o usuário PODE editar ou não
  public bsConfig: any;
  public equipamentos: any = {
    inversores: [],
    placas: []
  };
  tiposSuportes = tiposSuportes;
  hashCliente = null;
  loading = true;


  // Formulário para edição
  editForm: FormGroup;

  constructor(
    private pedidosService: PedidosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private equipamentosService: EquipamentosService,
    private route: ActivatedRoute,

  ) {

    this.bsConfig = {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      rangeInputFormat: 'DD/MM/YYYY',
      maxDate: new Date(),
      locale: 'pt-br'
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hashCliente = params['hash'];
      this.pedidosService.getPedidoHash(this.hashCliente).subscribe((pedido) => {
        this.loading = false;
        this.detalhes = pedido;
        this.patchForm(pedido);
      }, error => {
        this.loading = false;
        console.error('Erro ao obter pedido:', error);
        Swal.fire({
          title: 'Erro ao obter pedido',
          text: 'O seu pedido não foi encontrado, por favor, entre em contato com o suporte.',
          icon: "error",
          confirmButtonText: 'Ok'
        })
      });
    });


    // Obtendo usuário e cargo
    this.user = this.authService.getUser();
    this.userCargo = this.user?.cargo;

    // Verifica se pode editar
    this.canEdit = (this.userCargo === 'INSTALADOR' || this.userCargo === 'ADMINISTRADOR');

    // Inicializa o form
    this.editForm = this.initializeForm();

    // Obtendo equipamentos
    this.equipamentosService.getEquipamentos().subscribe(equip =>{
      this.equipamentos = equip
    })

  }

  onInversorChange(event: any) {
    this.editForm.get("garantiaFabricacaoInversor").setValue(event.garantiaFabricacao)
  }

  onModuloChange(event: any) {
    this.editForm.get("garantiaPerformancePlaca").setValue(event.garantiaPerformance)
    this.editForm.get("garantiaFabricacaoPlaca").setValue(event.garantiaFabricacao)
  }

  // Cria o FormGroup e seus campos
  initializeForm(): FormGroup {
    return this.fb.group({
      nomeCompleto: [null],
      cpfCliente: [null],
      celular: [null],
      email: [null],
      endereco: [null],

      status: [null],
      consumoMensal: [null],
      formaPagamento: [null],
      dataPedido: [null],
      observacao: [null],
      detalhes: this.fb.group({
        notaFiscalEnviada: [null],
        contratoAssinado: [null],
        visitaRealizada: [null],
        equipamentoComprado: [null],
        pagamentoRealizado: [null]
      }),

      instalacao: this.fb.group({
        potenciaGerador: [null],
        distribuidora: [null],

        // Exemplos de campos do seu snippet (inversores, placas etc.)
        inversores: [null],
        quantidadeInversores: [null],
        garantiaFabricacaoInversor: [null],

        placas: [null],
        quantidadePlacas: [null],
        garantiaFabricacaoPlaca: [null],
        garantiaPerformancePlaca: [null],

        suporte: [null],
        quantidadeSuportes: [null],

        dataInicio: [null],
        dataFim: [null],
      })
    });
  }

  // Dá "patch" no formulário com valores vindos de um pedido
  tratarData(control: string) {
    const form = this.editForm.get(control);
    if (form?.value) {
      const data = new Date(form.value);
      data.setHours(0, 0, 0, 0);
      form.setValue(data);
    }
  }

  patchForm(pedido: any) {
    if (!pedido) return;
    this.editForm.patchValue(pedido);

    this.tratarData("instalacao.dataInicio");
    this.tratarData("instalacao.dataFim");
  }

  // Alterna o modo de edição
  toggleEdit(): void {
    if (!this.canEdit) return; // Se não puder editar, não faz nada
    this.isEditing = !this.isEditing;

    // Se iniciou edição, patch nos campos; se finalizou edição, você pode enviar pro backend
    if (!this.isEditing) {
      // Exemplo: salvar as alterações
      this.salvarEdicoes();
    }
  }

  // Exemplo de método que salva alterações
  salvarEdicoes(): void {
    const valoresAtualizados = this.editForm.value;
    if(this.editForm.valid) {
      this.loading = true;
      this.pedidosService.updatePedido(this.detalhes.idPedido, valoresAtualizados).subscribe(resp => {
        this.loading = false;
        this.detalhes = { ...this.detalhes, ...valoresAtualizados };
        Swal.fire({
          title: 'Pedido atualizado',
          text: 'As alterações foram salvas com sucesso.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }, error => {
        this.loading = false;
        Swal.fire({
          title: 'Erro ao atualizar pedido',
          text: 'As alterações não foram salvas. Por favor, tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      })
    } else {
      console.log('formulário é inválido devido a:', valoresAtualizados.errors);
    }
  }
}
