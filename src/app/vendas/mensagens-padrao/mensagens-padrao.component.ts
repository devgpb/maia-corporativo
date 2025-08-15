import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { MensagensPadraoService, MensagemPadrao } from 'src/app/services/mensagensPadrao/mensagens-padrao.service';

@Component({
  selector: 'app-mensagens-padrao',
  templateUrl: './mensagens-padrao.component.html',
  styleUrls: ['./mensagens-padrao.component.scss'],
  standalone: false,
})
export class MensagensPadraoComponent implements OnInit {
  form!: FormGroup;
  mensagens: MensagemPadrao[] = [];
  carregando = false;
  criando = false;
  salvandoId: number | null = null;
  editandoIds = new Set<number>();

  // paginação
  total = 0;
  pagina = 1;
  limite = 12; // mostra 12 cards por página
  totalPaginas = 0;

  // buffers de edição por card
  editBuffer: Record<number, { nome: string; mensagem: string }> = {};

  constructor(
    private fb: FormBuilder,
    private service: MensagensPadraoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(255)]],
      mensagem: ['', [Validators.required]]
    });
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.service.listar(this.pagina, this.limite)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: ({ itens, total, pagina, limite }) => {
          this.mensagens = itens ?? [];
          this.total = total ?? this.mensagens.length;
          this.pagina = pagina ?? 1;
          this.limite = limite ?? this.limite;
          this.totalPaginas = Math.max(1, Math.ceil(this.total / this.limite));
        },
        error: (err) => this.alertaErro('Erro ao carregar mensagens', err)
      });
  }

  criar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.criando = true;
    const payload = this.form.value;
    this.service.criar(payload)
      .pipe(finalize(() => (this.criando = false)))
      .subscribe({
        next: () => {
          // após criar, recarrega a página atual (ou vai para a 1ª para visualizar no topo, se preferir)
          this.pagina = 1;
          this.carregar();
          this.form.reset();
          Swal.fire({ icon: 'success', title: 'Criado!', text: 'Mensagem criada com sucesso.', timer: 1500, showConfirmButton: false });
        },
        error: (err) => this.alertaErro('Erro ao criar mensagem', err)
      });
  }

  iniciarEdicao(item: MensagemPadrao): void {
    this.editandoIds.add(item.idMensagem);
    this.editBuffer[item.idMensagem] = { nome: item.nome, mensagem: item.mensagem };
  }

  cancelarEdicao(idMensagem: number): void {
    this.editandoIds.delete(idMensagem);
    delete this.editBuffer[idMensagem];
  }

  salvarEdicao(idMensagem: number): void {
    const buffer = this.editBuffer[idMensagem];
    if (!buffer || !buffer.nome || !buffer.mensagem) {
      Swal.fire({ icon: 'warning', title: 'Campos obrigatórios', text: 'Preencha nome e mensagem.' });
      return;
    }
    this.salvandoId = idMensagem;
    this.service.atualizar(idMensagem, { nome: buffer.nome, mensagem: buffer.mensagem })
      .pipe(finalize(() => (this.salvandoId = null)))
      .subscribe({
        next: () => {
          // recarrega a página atual para refletir dados do servidor
          this.carregar();
          this.cancelarEdicao(idMensagem);
          Swal.fire({ icon: 'success', title: 'Atualizado!', text: 'Mensagem atualizada com sucesso.', timer: 1500, showConfirmButton: false });
        },
        error: (err) => this.alertaErro('Erro ao atualizar mensagem', err)
      });
  }

  deletar(item: MensagemPadrao): void {
    Swal.fire({
      icon: 'question',
      title: 'Deletar mensagem?',
      text: `Tem certeza que deseja deletar "${item.nome}"?`,
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.isConfirmed) {
        this.service.deletar(item.idMensagem).subscribe({
          next: () => {
            // se a página ficar vazia após deletar, volta uma página (quando possível)
            const restante = this.total - 1 - (this.pagina - 1) * this.limite;
            if (restante <= 0 && this.pagina > 1) this.pagina -= 1;
            this.carregar();
            Swal.fire({ icon: 'success', title: 'Deletado!', timer: 1200, showConfirmButton: false });
          },
          error: (err) => this.alertaErro('Erro ao deletar mensagem', err)
        });
      }
    });
  }

  // paginação - helpers
  irParaPrimeira() { if (this.pagina !== 1) { this.pagina = 1; this.carregar(); } }
  irParaAnterior() { if (this.pagina > 1) { this.pagina -= 1; this.carregar(); } }
  irParaProxima() { if (this.pagina < this.totalPaginas) { this.pagina += 1; this.carregar(); } }
  irParaUltima() { if (this.pagina !== this.totalPaginas) { this.pagina = this.totalPaginas; this.carregar(); } }
  irPara(p: number) { if (p >= 1 && p <= this.totalPaginas && p !== this.pagina) { this.pagina = p; this.carregar(); } }

  paginasVisiveis(): number[] {
    const delta = 2; // quantidade de páginas vizinhas
    const pages: number[] = [];
    const start = Math.max(1, this.pagina - delta);
    const end = Math.min(this.totalPaginas, this.pagina + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    // garante sempre mostrar 1 e última quando forem omitidas
    if (pages[0] !== 1) pages.unshift(1);
    if (pages[pages.length - 1] !== this.totalPaginas) pages.push(this.totalPaginas);
    // remove duplicados
    return [...new Set(pages)];
  }

  trackById(_: number, item: MensagemPadrao) { return item.idMensagem; }

  private alertaErro(titulo: string, err: any) {
    console.error(err);
    const msg = err?.error?.message || err?.message || 'Tente novamente em instantes.';
    Swal.fire({ icon: 'error', title: titulo, text: msg });
  }

  isEditando(idMensagem: number) { return this.editandoIds.has(idMensagem); }
}
