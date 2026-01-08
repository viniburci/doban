import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { PessoaService } from '../../services/pessoa-service';
import { PessoaFormData } from '../../entities/pessoaFormaData.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CadastroVaga } from "../../vaga/cadastro-vaga/cadastro-vaga";
import { ScrollOnRenderDirective } from '../../directives/scroll-on-render-directive';
import { VagaFormData } from '../../entities/vagaFormData.model';
import { VagaService } from '../../services/vaga-service';
import { CardVaga } from "../../vaga/card-vaga/card-vaga";
import { RecursoCelularResponseDTO } from '../../entities/recursoCelularResponseDTO.model';
import { RecursoService } from '../../services/recurso-service';
import { CardRecursoCelular } from "../../recursos/recurso-celular/card-recurso-celular/card-recurso-celular";
import { RecursoCarroResponseDTO } from '../../entities/recursoCarroResponseDTO.model';
import { CardRecursoCarro } from "../../recursos/recurso-carro/card-recurso-carro/card-recurso-carro";
import { RecursoRocadeiraResponseDTO } from '../../entities/recursoRocadeiraResponseDTO.model';
import { CardRecursoRocadeira } from "../../recursos/recurso-rocadeira/card-recurso-rocadeira/card-recurso-rocadeira";
import { CadastroRecursoBase } from '../../recursos/shared/cadastro-recurso-base/cadastro-recurso-base';
import { RecursoFormConfig } from '../../recursos/shared/recurso-form-config.interface';
import { CarroService } from '../../services/carro-service';
import { CelularService } from '../../services/celular-service';
import { RocadeiraService } from '../../services/rocadeira-service';
import { RecursoCelularRequestDTO } from '../../entities/recursoCelularRequestDTO.model';
import { RecursoCarroRequestDTO } from '../../entities/recursoCarroRequestDTO.model';
import { RecursoRocadeiraRequestDTO } from '../../entities/recursoRocadeiraRequestDTO.model';
import { CelularFormData } from '../../entities/celularFormData.model';
import { CarroFormData } from '../../entities/carroFormData.model';
import { RocadeiraResponseDTO } from '../../entities/rocadeiraResponseDTO.model';

type RecursoType = RecursoCelularResponseDTO | RecursoCarroResponseDTO | RecursoRocadeiraResponseDTO;
type RecursoListType = 'celular' | 'carro' | 'rocadeira';

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [CommonModule, RouterLink, CadastroVaga, ScrollOnRenderDirective, CardVaga, CardRecursoCelular, CardRecursoCarro, CardRecursoRocadeira, CadastroRecursoBase],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalhesPessoa implements OnInit {

  private pessoaService = inject(PessoaService);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);
  private recursoService = inject(RecursoService);
  private carroService = inject(CarroService);
  private celularService = inject(CelularService);
  private rocadeiraService = inject(RocadeiraService);

  pessoaId = input<string | null>(null);
  errorMessage: string | null = null;
  pessoa = signal<PessoaFormData | null>(null);
  vagasPessoa = signal<VagaFormData[] | null>(null);

  editVaga = signal<VagaFormData | null>(null);
  showRegistrarVaga = signal<boolean>(false);

  // Recurso genérico
  editRecurso = signal<RecursoType | null>(null);
  activeResourceType = signal<RecursoListType | null>(null);
  showRegistrarRecurso = signal<boolean>(false);

  celularesList = signal<RecursoCelularResponseDTO[] | null>(null);
  carrosList = signal<RecursoCarroResponseDTO[] | null>(null);
  rocadeirasList = signal<RecursoRocadeiraResponseDTO[] | null>(null);

  // Maps para acesso eficiente
  private readonly recursoListMap = computed(() => new Map<RecursoListType, RecursoType[] | null>([
    ['celular', this.celularesList()],
    ['carro', this.carrosList()],
    ['rocadeira', this.rocadeirasList()]
  ]));

  // Configurações dos formulários
  celularFormConfig: RecursoFormConfig<RecursoCelularRequestDTO, RecursoCelularResponseDTO, CelularFormData> = {
    fieldConfig: {
      resourceTypeLabel: 'Celular',
      resourceIdField: 'celularId',
      resourceIdLabel: 'Selecione o Celular'
    },
    createFn: (req) => this.recursoService.createRecursoCelular(req),
    updateFn: (id, dto) => this.recursoService.registrarDevolucaoCelular(id, dto),
    listFn: () => this.celularService.listar(),
    displayFn: (cel) => `${cel.modelo} - ${cel.imei}`
  };

  carroFormConfig: RecursoFormConfig<RecursoCarroRequestDTO, RecursoCarroResponseDTO, CarroFormData> = {
    fieldConfig: {
      resourceTypeLabel: 'Carro',
      resourceIdField: 'carroId',
      resourceIdLabel: 'Selecione o Carro'
    },
    createFn: (req) => this.recursoService.createRecursoCarro(req),
    updateFn: (id, dto) => this.recursoService.registrarDevolucaoCarro(id, dto),
    listFn: () => this.carroService.listar(),
    displayFn: (car) => `${car.modelo} - ${car.placa}`
  };

  rocadeiraFormConfig: RecursoFormConfig<RecursoRocadeiraRequestDTO, RecursoRocadeiraResponseDTO, RocadeiraResponseDTO> = {
    fieldConfig: {
      resourceTypeLabel: 'Roçadeira',
      resourceIdField: 'rocadeiraId',
      resourceIdLabel: 'Selecione a Roçadeira'
    },
    createFn: (req) => this.recursoService.createRecursoRocadeira(req),
    updateFn: (id, dto) => this.recursoService.registrarDevolucaoRocadeira(id, dto),
    listFn: () => this.rocadeiraService.listarRocadeiras(),
    displayFn: (roc) => `${roc.marca} - ${roc.numeroSerie}`
  };

  private readonly recursoConfigMap = new Map<RecursoListType, RecursoFormConfig<any, any, any>>([
    ['celular', this.celularFormConfig],
    ['carro', this.carroFormConfig],
    ['rocadeira', this.rocadeiraFormConfig]
  ]);

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.updateComponent();
    } else {
      this.errorMessage = 'Id inválido.'
    }
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

  toggleRegistrarRecurso(type: 'celular' | 'carro' | 'rocadeira') {
    this.handleOnlyClose();
    this.activeResourceType.set(type);
    this.showRegistrarRecurso.set(true);
  }

  novoRecurso(type: 'celular' | 'carro' | 'rocadeira') {
    this.editRecurso.set(null);
    this.toggleRegistrarRecurso(type);
  }

  editarVaga(event: any) {
    this.toggleRegistrarVaga();
    let vaga = this.vagasPessoa()?.find(v => v.id === event);
    if (vaga) {
      this.editVaga.set(vaga);
    }
  }

  editarRecurso(type: RecursoListType, id: string) {
    const lista = this.recursoListMap().get(type);
    const recurso = lista?.find(r => Number(r.id) === +id);

    if (!recurso) return;

    this.editRecurso.set(recurso);
    this.toggleRegistrarRecurso(type);
  }

  getActiveConfig(): RecursoFormConfig<any, any, any> {
    const type = this.activeResourceType();
    return this.recursoConfigMap.get(type ?? 'celular') ?? this.celularFormConfig;
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

    this.recursoService.getRecursoCelularByPessoaId(id).subscribe(data => {
      this.celularesList.set(data.sort(this.sortByDate));
    });

    this.recursoService.getRecursoCarroByPessoaId(id).subscribe(data => {
      this.carrosList.set(data.sort(this.sortByDate));
    });

    this.recursoService.getRecursoRocadeiraByPessoaId(id).subscribe(data => {
      this.rocadeirasList.set(data.sort(this.sortByDate));
    });
  }

  handleOnlyClose() {
    this.showRegistrarVaga.set(false);
    this.showRegistrarRecurso.set(false);
    this.activeResourceType.set(null);
  }
}
