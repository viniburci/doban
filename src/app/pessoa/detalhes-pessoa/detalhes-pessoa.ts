import { afterNextRender, ChangeDetectorRef, Component, EnvironmentInjector, inject, input, OnInit, runInInjectionContext, signal } from '@angular/core';
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

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [CommonModule, RouterLink, CadastroVaga, ScrollOnRenderDirective, CardVaga, CardRecursoCelular, CardRecursoCarro, CardRecursoRocadeira, CadastroRecursoBase],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css'
})
export class DetalhesPessoa implements OnInit {

  private pessoaService = inject(PessoaService);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);
  private recursoService = inject(RecursoService);
  private carroService = inject(CarroService);
  private celularService = inject(CelularService);
  private rocadeiraService = inject(RocadeiraService);
  private cdr = inject(ChangeDetectorRef);

  pessoaId = input<string | null>(null);
  errorMessage: string | null = null;
  pessoa = signal<PessoaFormData | null>(null);
  vagasPessoa = signal<VagaFormData[] | null>(null);

  editVaga = signal<VagaFormData | null>(null);
  showRegistrarVaga = signal<boolean>(false);

  // Recurso genérico
  editRecurso = signal<any | null>(null);
  activeResourceType = signal<'celular' | 'carro' | 'rocadeira' | null>(null);
  showRegistrarRecurso = signal<boolean>(false);

  celularesList = signal<RecursoCelularResponseDTO[] | null>(null);
  carrosList = signal<RecursoCarroResponseDTO[] | null>(null);
  rocadeirasList = signal<RecursoRocadeiraResponseDTO[] | null>(null);

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
    this.cdr.detectChanges();
  }

  private envInjector = inject(EnvironmentInjector);
  toggleRegistrarRecurso(type: 'celular' | 'carro' | 'rocadeira') {
    this.handleOnlyClose();

    runInInjectionContext(this.envInjector, () => {
      afterNextRender(() => {
        this.activeResourceType.set(type);
        this.showRegistrarRecurso.set(true);
      });
    });
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

  editarRecurso(type: 'celular' | 'carro' | 'rocadeira', id: string) {
    this.toggleRegistrarRecurso(type);

    let recurso: any;
    switch(type) {
      case 'celular':
        recurso = this.celularesList()?.find(r => Number(r.id) === +id);
        break;
      case 'carro':
        recurso = this.carrosList()?.find(r => Number(r.id) === +id);
        break;
      case 'rocadeira':
        recurso = this.rocadeirasList()?.find(r => Number(r.id) === +id);
        break;
    }

    if (!recurso) return;

    this.editRecurso.set(recurso);
    this.toggleRegistrarRecurso(type);
  }

  getActiveConfig(): any {
    switch(this.activeResourceType()) {
      case 'celular': return this.celularFormConfig;
      case 'carro': return this.carroFormConfig;
      case 'rocadeira': return this.rocadeiraFormConfig;
      default: return this.celularFormConfig;
    }
  }

  handleUpdateAndClose() {
    this.updateComponent();

    this.handleOnlyClose();
  }

  updateComponent() {
    const id = this.pessoaId();
    this.pessoaService.buscarPessoa(Number(id)).subscribe(data => {
      this.pessoa.set(data);
      this.convertDatesToBr();
    });
    this.vagaService.getVagaPorPessoa(Number(id)).subscribe(data => {
      data.sort((a, b) => (a.dataAdmissao ?? '') > (b.dataAdmissao ?? '') ? 1 : -1);
      this.vagasPessoa.set(data);
    })
    this.recursoService.getRecursoCelularByPessoaId(Number(id)).subscribe(data => {
      data.sort((a, b) => (a.dataEntrega ?? '') > (b.dataEntrega ?? '') ? 1 : -1);
      this.celularesList.set(data);
    });
    this.recursoService.getRecursoCarroByPessoaId(Number(id)).subscribe(data => {
      data.sort((a, b) => (a.dataEntrega ?? '') > (b.dataEntrega ?? '') ? 1 : -1);
      this.carrosList.set(data);
    })
    this.recursoService.getRecursoRocadeiraByPessoaId(Number(id)).subscribe(data => {
      data.sort((a, b) => (a.dataEntrega ?? '') > (b.dataEntrega ?? '') ? 1 : -1);
      this.rocadeirasList.set(data);
    });
  }

  handleOnlyClose() {
    this.showRegistrarVaga.set(false);
    this.showRegistrarRecurso.set(false);
    this.activeResourceType.set(null);
  }
}
