import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { DataService } from '../../services/data-service';
import { RouterLink } from '@angular/router';
import { CadastroVaga } from "../../vaga/cadastro-vaga/cadastro-vaga";
import { ScrollOnRenderDirective } from '../../directives/scroll-on-render-directive';
import { VagaFormData } from '../../entities/vagaFormData.model';
import { VagaService } from '../../services/vaga-service';
import { CardVaga } from "../../vaga/card-vaga/card-vaga";
import { ItemExtraDTO, RecursoDinamicoDTO } from '../../entities/recurso-dinamico.model';
import { TipoRecursoDTO } from '../../entities/tipo-recurso.model';
import { RecursoDinamicoService } from '../../services/recurso-dinamico.service';
import { TipoRecursoService } from '../../services/tipo-recurso.service';
import { CardRecursoDinamico } from "../../recursos/recurso-dinamico/card-recurso-dinamico/card-recurso-dinamico";
import { FormRecursoDinamico } from "../../recursos/recurso-dinamico/form-recurso-dinamico/form-recurso-dinamico";
import { DocumentoService, TipoDocumento, TIPOS_DOCUMENTOS_VAGA } from '../../services/documento.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDTO } from '../../entities/cliente.model';

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [RouterLink, CadastroVaga, ScrollOnRenderDirective, CardVaga, CardRecursoDinamico, FormRecursoDinamico, ReactiveFormsModule],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalhesPessoa implements OnInit {

  private fb = inject(FormBuilder);
  private pessoaService = inject(PessoaService);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);
  private recursoDinamicoService = inject(RecursoDinamicoService);
  private tipoRecursoService = inject(TipoRecursoService);
  private documentoService = inject(DocumentoService);
  private clienteService = inject(ClienteService);

  private destroyRef = inject(DestroyRef);

  pessoaId = input<string | null>(null);
  errorMessage: string | null = null;
  pessoa = signal<PessoaFormData | null>(null);
  vagasPessoa = signal<VagaFormData[] | null>(null);

  // Foto de perfil
  fotoUrl = signal<string | null>(null);
  fotoCarregando = signal(false);
  fotoUploadando = signal(false);
  fotoPreviewUrl = signal<string | null>(null);
  fotoErro = signal<string | null>(null);

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

  // Itens extras editaveis do recurso selecionado
  itensExtrasEditaveis = signal<ItemExtraDTO[]>([]);
  salvandoItensExtras = signal(false);
  itensSalvosComSucesso = signal(false);
  itemExtraForm: FormGroup = this.fb.group({
    descricao: ['', Validators.required],
    marca: [''],
    numeroSerie: [''],
    ddd: [''],
    quantidade: [1, [Validators.min(1)]],
    valor: [0, [Validators.min(0)]]
  });

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

  iniciais = computed(() => {
    const nome = this.pessoa()?.nome;
    if (!nome) return '?';
    const partes = nome.trim().split(/\s+/);
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return partes[0][0].toUpperCase();
  });

  tipoRecursoSelecionado = computed(() => {
    const recursoId = this.recursoSelecionadoId();
    if (!recursoId) return null;

    const recurso = this.recursosDinamicos().find(r => r.id === recursoId);
    return recurso?.item.tipoRecursoCodigo ?? null;
  });

  // Controle de accordion para seções de informações
  secaoContatoAberta = signal(false);
  secaoDocumentosAberta = signal(false);
  secaoCnhAberta = signal(false);
  secaoCtpsAberta = signal(false);
  secaoEnderecoAberta = signal(false);
  secaoBancariaAberta = signal(false);
  secaoTamanhosAberta = signal(false);

  toggleSecao(secao: string) {
    switch(secao) {
      case 'contato':
        this.secaoContatoAberta.update(v => !v);
        break;
      case 'documentos':
        this.secaoDocumentosAberta.update(v => !v);
        break;
      case 'cnh':
        this.secaoCnhAberta.update(v => !v);
        break;
      case 'ctps':
        this.secaoCtpsAberta.update(v => !v);
        break;
      case 'endereco':
        this.secaoEnderecoAberta.update(v => !v);
        break;
      case 'bancaria':
        this.secaoBancariaAberta.update(v => !v);
        break;
      case 'tamanhos':
        this.secaoTamanhosAberta.update(v => !v);
        break;
    }
  }


  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.updateComponent();
      this.carregarTiposRecurso();
      this.carregarClientes();
      this.carregarFoto(Number(id));

      this.destroyRef.onDestroy(() => {
        const url = this.fotoUrl();
        if (url) URL.revokeObjectURL(url);
        const preview = this.fotoPreviewUrl();
        if (preview) URL.revokeObjectURL(preview);
      });
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
      this.itensExtrasEditaveis.set([]);
    } else {
      this.recursoSelecionadoId.set(recursoId);
      // Carregar itens extras do recurso para edicao
      const recurso = this.recursosDinamicos().find(r => r.id === recursoId);
      this.itensExtrasEditaveis.set(recurso?.itensExtras ? [...recurso.itensExtras] : []);
    }
  }

  isRecursoSelecionado(recursoId: number): boolean {
    return this.recursoSelecionadoId() === recursoId;
  }

  limparSelecaoRecursos() {
    this.recursoSelecionadoId.set(null);
    this.clienteSelecionadoId.set(null);
    this.itensExtrasEditaveis.set([]);
    this.itemExtraForm.reset({ descricao: '', marca: '', numeroSerie: '', ddd: '', quantidade: 1, valor: 0 });
  }

  selecionarCliente(clienteId: number | null) {
    this.clienteSelecionadoId.set(clienteId);
  }

  adicionarItemExtra() {
    if (this.itemExtraForm.invalid) return;

    const item: ItemExtraDTO = this.itemExtraForm.getRawValue();
    this.itensExtrasEditaveis.update(itens => [...itens, item]);
    this.itemExtraForm.reset({ descricao: '', marca: '', numeroSerie: '', ddd: '', quantidade: 1, valor: 0 });
  }

  removerItemExtra(index: number) {
    this.itensExtrasEditaveis.update(itens => itens.filter((_, i) => i !== index));
  }

  salvarItensExtras() {
    const recursoId = this.recursoSelecionadoId();
    if (!recursoId) return;

    this.salvandoItensExtras.set(true);

    this.recursoDinamicoService.atualizarItensExtras(recursoId, this.itensExtrasEditaveis()).subscribe({
      next: () => {
        this.salvandoItensExtras.set(false);
        this.itensSalvosComSucesso.set(true);
        setTimeout(() => this.itensSalvosComSucesso.set(false), 2000);
        this.updateComponent();
      },
      error: (error) => {
        console.error('Erro ao salvar itens extras:', error);
        this.salvandoItensExtras.set(false);
      }
    });
  }

  gerarTermoResponsabilidade() {
    const recursoId = this.recursoSelecionadoId();
    if (!recursoId) return;

    this.gerandoDocumento.set(true);

    this.documentoService.gerarTermoEmprestimoDoRecurso(recursoId, this.clienteSelecionadoId()).subscribe({
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
    const recursoId = this.recursoSelecionadoId();
    if (!recursoId) return;

    this.gerandoDocumento.set(true);

    this.documentoService.gerarTermoDevolucaoDoRecurso(recursoId, this.clienteSelecionadoId()).subscribe({
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

  private carregarFoto(pessoaId: number): void {
    this.fotoCarregando.set(true);
    this.pessoaService.buscarFoto(pessoaId).subscribe({
      next: (blob) => {
        const oldUrl = this.fotoUrl();
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        this.fotoUrl.set(URL.createObjectURL(blob));
        this.fotoCarregando.set(false);
      },
      error: () => {
        this.fotoUrl.set(null);
        this.fotoCarregando.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.fotoErro.set(null);

    if (!file.type.startsWith('image/')) {
      this.fotoErro.set('Selecione apenas arquivos de imagem.');
      input.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.fotoErro.set('A imagem deve ter no maximo 5MB.');
      input.value = '';
      return;
    }

    const oldPreview = this.fotoPreviewUrl();
    if (oldPreview) URL.revokeObjectURL(oldPreview);

    const previewUrl = URL.createObjectURL(file);
    this.fotoPreviewUrl.set(previewUrl);
    this.fotoUploadando.set(true);

    const pessoaId = Number(this.pessoaId());
    this.pessoaService.uploadFoto(pessoaId, file).subscribe({
      next: () => {
        URL.revokeObjectURL(previewUrl);
        this.fotoPreviewUrl.set(null);
        this.fotoUploadando.set(false);
        this.carregarFoto(pessoaId);
      },
      error: (err) => {
        this.fotoErro.set('Erro ao enviar foto. Tente novamente.');
        this.fotoUploadando.set(false);
        console.error('Erro ao enviar foto:', err);
      }
    });

    input.value = '';
  }

  gerarCarroChecklist() {
    const recursoId = this.recursoSelecionadoId();
    if (!recursoId) return;

    this.gerandoDocumento.set(true);

    this.documentoService.gerarCarroChecklist(recursoId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.gerandoDocumento.set(false);
      },
      error: (error) => {
        console.error('Erro ao gerar checklist do carro:', error);
        this.gerandoDocumento.set(false);
      }
    });
  }
}
