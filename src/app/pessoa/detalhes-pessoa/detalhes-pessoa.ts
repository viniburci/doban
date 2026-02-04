import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { DataService } from '../../services/data-service';
import { RouterLink } from '@angular/router';
import { CadastroVaga } from "../../vaga/cadastro-vaga/cadastro-vaga";
import { ScrollOnRenderDirective } from '../../directives/scroll-on-render-directive';
import { VagaFormData } from '../../entities/vagaFormData.model';
import { VagaService } from '../../services/vaga-service';
import { CardVaga } from "../../vaga/card-vaga/card-vaga";
import { RecursoDinamicoDTO } from '../../entities/recurso-dinamico.model';
import { TipoRecursoDTO } from '../../entities/tipo-recurso.model';
import { RecursoDinamicoService } from '../../services/recurso-dinamico.service';
import { TipoRecursoService } from '../../services/tipo-recurso.service';
import { CardRecursoDinamico } from "../../recursos/recurso-dinamico/card-recurso-dinamico/card-recurso-dinamico";
import { FormRecursoDinamico } from "../../recursos/recurso-dinamico/form-recurso-dinamico/form-recurso-dinamico";
import { DocumentoService, TipoDocumento, TIPOS_DOCUMENTOS_VAGA } from '../../services/documento.service';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDTO } from '../../entities/cliente.model';

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [RouterLink, CadastroVaga, ScrollOnRenderDirective, CardVaga, CardRecursoDinamico, FormRecursoDinamico],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalhesPessoa implements OnInit {

  private pessoaService = inject(PessoaService);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);
  private recursoDinamicoService = inject(RecursoDinamicoService);
  private tipoRecursoService = inject(TipoRecursoService);
  private documentoService = inject(DocumentoService);
  private clienteService = inject(ClienteService);

  pessoaId = input<string | null>(null);
  errorMessage: string | null = null;
  pessoa = signal<PessoaFormData | null>(null);
  vagasPessoa = signal<VagaFormData[] | null>(null);

  editVaga = signal<VagaFormData | null>(null);
  showRegistrarVaga = signal<boolean>(false);

  recursosDinamicos = signal<RecursoDinamicoDTO[]>([]);
  tiposRecurso = signal<TipoRecursoDTO[]>([]);
  tipoFiltroSelecionado = signal<string | null>(null);
  editRecursoDinamico = signal<RecursoDinamicoDTO | null>(null);
  showFormRecursoDinamico = signal(false);

  tiposDocumentos = signal<TipoDocumento[]>(TIPOS_DOCUMENTOS_VAGA.map(t => ({ ...t })));
  vagaSelecionadaParaDocumento = signal<number | null>(null);
  gerandoDocumento = signal(false);
  showGeradorDocumento = signal(false);

  // Selecao de recurso para documentos (apenas 1 por vez)
  recursoSelecionadoId = signal<number | null>(null);

  // Clientes para termo de responsabilidade
  clientes = signal<ClienteDTO[]>([]);
  clienteSelecionadoId = signal<number | null>(null);

  temDocumentoSelecionado = computed(() =>
    this.tiposDocumentos().some(t => t.selecionado)
  );

  quantidadeSelecionados = computed(() =>
    this.tiposDocumentos().filter(t => t.selecionado).length
  );

  tipoVagaIdSelecionado = computed(() => {
    const vagaId = this.vagaSelecionadaParaDocumento();
    if (!vagaId) return null;

    const vaga = this.vagasPessoa()?.find(v => v.id === String(vagaId));
    return vaga?.tipoVagaId ?? null;
  });

  recursosFiltrados = computed(() => {
    const recursos = this.recursosDinamicos();
    const filtro = this.tipoFiltroSelecionado();

    if (!filtro) return recursos;
    return recursos.filter(r => r.item.tipoRecursoCodigo === filtro);
  });

  contadorPorTipo = computed(() => {
    const recursos = this.recursosDinamicos();
    const tipos = this.tiposRecurso();

    return tipos.map(tipo => ({
      codigo: tipo.codigo,
      nome: tipo.nome,
      count: recursos.filter(r => r.item.tipoRecursoCodigo === tipo.codigo).length
    }));
  });

  temRecursoSelecionado = computed(() => this.recursoSelecionadoId() !== null);

  tipoRecursoSelecionado = computed(() => {
    const recursoId = this.recursoSelecionadoId();
    if (!recursoId) return null;

    const recurso = this.recursosDinamicos().find(r => r.id === recursoId);
    return recurso?.item.tipoRecursoCodigo ?? null;
  });

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.updateComponent();
      this.carregarTiposRecurso();
      this.carregarClientes();
    } else {
      this.errorMessage = 'Id inválido.'
    }
  }

  carregarTiposRecurso() {
    this.tipoRecursoService.listarAtivos().subscribe({
      next: (response) => {
        this.tiposRecurso.set(response);
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de recurso', error);
      }
    });
  }

  carregarClientes() {
    this.clienteService.listarAtivos().subscribe({
      next: (response) => {
        this.clientes.set(response);
      },
      error: (error) => {
        console.error('Erro ao carregar clientes', error);
      }
    });
  }

  convertDatesToBr() {
    const pessoa = this.pessoa();
    if (!pessoa) return;

    const d = this.dataService;

    pessoa.dataNascimento = d.convertISOToDateBR(pessoa.dataNascimento);
    pessoa.dataEmissaoCtps = d.convertISOToDateBR(pessoa.dataEmissaoCtps);
    pessoa.dataEmissaoRg = d.convertISOToDateBR(pessoa.dataEmissaoRg);
    pessoa.dataEmissaoPis = d.convertISOToDateBR(pessoa.dataEmissaoPis);
    pessoa.validadeCnh = d.convertISOToDateBR(pessoa.validadeCnh);
  }

  toggleRegistrarVaga() {
    this.handleOnlyClose();
    this.editVaga.set(null);
    this.showRegistrarVaga.set(!this.showRegistrarVaga());
  }

  novoEmprestimo() {
    this.handleOnlyClose();
    this.editRecursoDinamico.set(null);
    this.showFormRecursoDinamico.set(true);
  }

  filtrarPorTipo(codigo: string | null) {
    this.tipoFiltroSelecionado.set(codigo);
  }

  editarVaga(event: any) {
    this.toggleRegistrarVaga();
    let vaga = this.vagasPessoa()?.find(v => v.id === event);
    if (vaga) {
      this.editVaga.set(vaga);
    }
  }

  editarEmprestimo(id: number) {
    const recurso = this.recursosDinamicos().find(r => r.id === id);

    if (!recurso) return;

    this.editRecursoDinamico.set(recurso);
    this.handleOnlyClose();
    this.showFormRecursoDinamico.set(true);
  }

  handleUpdateAndClose() {
    this.updateComponent();
    this.handleOnlyClose();
  }

  private sortByDate<T extends { dataAdmissao?: string | null; dataEntrega?: string | null }>(a: T, b: T): number {
    const dateA = a.dataAdmissao ?? a.dataEntrega ?? '';
    const dateB = b.dataAdmissao ?? b.dataEntrega ?? '';
    return dateA > dateB ? 1 : -1;
  }

  updateComponent() {
    const id = Number(this.pessoaId());

    this.pessoaService.buscarPessoa(id).subscribe(data => {
      this.pessoa.set(data);
      this.convertDatesToBr();
    });

    this.vagaService.getVagaPorPessoa(id).subscribe(data => {
      this.vagasPessoa.set(data.sort(this.sortByDate));
      console.log('Vagas carregadas:', data);
    });

    this.recursoDinamicoService.listarPorPessoa(id).subscribe(data => {
      this.recursosDinamicos.set(data.sort(this.sortByDate));
    });
  }

  handleOnlyClose() {
    this.showRegistrarVaga.set(false);
    this.showFormRecursoDinamico.set(false);
    this.showGeradorDocumento.set(false);
  }

  abrirGeradorDocumento() {
    this.handleOnlyClose();
    this.showGeradorDocumento.set(true);
  }

  toggleDocumento(id: string) {
    this.tiposDocumentos.update(tipos =>
      tipos.map(t => t.id === id ? { ...t, selecionado: !t.selecionado } : t)
    );
  }

  selecionarTodosDocumentos(selecionado: boolean) {
    this.tiposDocumentos.update(tipos =>
      tipos.map(t => ({ ...t, selecionado }))
    );
  }

  selecionarVagaParaDocumento(vagaId: number) {
    this.vagaSelecionadaParaDocumento.set(vagaId);
  }

  gerarDocumentosCombinados() {
    const vagaId = this.vagaSelecionadaParaDocumento();
    if (!vagaId) return;

    const tiposSelecionados = this.tiposDocumentos()
      .filter(t => t.selecionado)
      .map(t => t.id);

    if (tiposSelecionados.length === 0) return;

    this.gerandoDocumento.set(true);

    this.documentoService.gerarDocumentosCombinados(vagaId, tiposSelecionados).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.gerandoDocumento.set(false);
      },
      error: (error) => {
        console.error('Erro ao gerar documentos:', error);
        this.gerandoDocumento.set(false);
      }
    });
  }

  gerarDocumentoIndividual(tipo: string) {
    const vagaId = this.vagaSelecionadaParaDocumento();
    if (!vagaId) return;

    this.gerandoDocumento.set(true);

    this.documentoService.gerarDocumento(vagaId, tipo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.gerandoDocumento.set(false);
      },
      error: (error) => {
        console.error('Erro ao gerar documento:', error);
        this.gerandoDocumento.set(false);
      }
    });
  }

  // Selecao de recurso para documentos (apenas 1 por vez)
  toggleRecursoSelecionado(recursoId: number) {
    const atual = this.recursoSelecionadoId();
    if (atual === recursoId) {
      this.recursoSelecionadoId.set(null);
    } else {
      this.recursoSelecionadoId.set(recursoId);
    }
  }

  isRecursoSelecionado(recursoId: number): boolean {
    return this.recursoSelecionadoId() === recursoId;
  }

  limparSelecaoRecursos() {
    this.recursoSelecionadoId.set(null);
    this.clienteSelecionadoId.set(null);
  }

  selecionarCliente(clienteId: number | null) {
    this.clienteSelecionadoId.set(clienteId);
  }

  getItemIdsDosRecursosSelecionados(): number[] {
    const recursoId = this.recursoSelecionadoId();
    if (!recursoId) return [];

    const recurso = this.recursosDinamicos().find(r => r.id === recursoId);
    if (!recurso || recurso.item.id === null) return [];

    return [recurso.item.id];
  }

  gerarTermoResponsabilidade() {
    const pessoaId = Number(this.pessoaId());
    const itemIds = this.getItemIdsDosRecursosSelecionados();
    const clienteId = this.clienteSelecionadoId();

    if (!pessoaId || itemIds.length === 0) return;

    this.gerandoDocumento.set(true);

    this.documentoService.gerarTermoResponsabilidadeMateriais(pessoaId, itemIds, clienteId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.gerandoDocumento.set(false);
      },
      error: (error) => {
        console.error('Erro ao gerar termo:', error);
        this.gerandoDocumento.set(false);
      }
    });
  }

  gerarDeclaracaoDevolucao() {
    const pessoaId = Number(this.pessoaId());
    const itemIds = this.getItemIdsDosRecursosSelecionados();

    if (!pessoaId || itemIds.length === 0) return;

    this.gerandoDocumento.set(true);

    this.documentoService.gerarDeclaracaoDevolucaoAparelho(pessoaId, itemIds).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.gerandoDocumento.set(false);
      },
      error: (error) => {
        console.error('Erro ao gerar declaracao:', error);
        this.gerandoDocumento.set(false);
      }
    });
  }
}
