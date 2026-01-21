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
import { DocumentoService, TipoDocumento, TIPOS_DOCUMENTOS } from '../../services/documento.service';
import { GeradorDocumento } from "../../documentos/gerador-documento/gerador-documento";

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [RouterLink, CadastroVaga, ScrollOnRenderDirective, CardVaga, CardRecursoDinamico, FormRecursoDinamico, GeradorDocumento],
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

  tiposDocumentos = signal<TipoDocumento[]>(TIPOS_DOCUMENTOS.map(t => ({ ...t })));
  vagaSelecionadaParaDocumento = signal<number | null>(null);
  gerandoDocumento = signal(false);
  showGeradorDocumento = signal(false);

  temDocumentoSelecionado = computed(() =>
    this.tiposDocumentos().some(t => t.selecionado)
  );

  quantidadeSelecionados = computed(() =>
    this.tiposDocumentos().filter(t => t.selecionado).length
  );

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

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.updateComponent();
      this.carregarTiposRecurso();
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
}
