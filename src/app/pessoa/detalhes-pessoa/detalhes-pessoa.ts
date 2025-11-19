import { ChangeDetectorRef, Component, inject, input, OnInit, signal } from '@angular/core';
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
import { CadastroRecursoCelular } from "../../recursos/recurso-celular/cadastro-recurso-celular/cadastro-recurso-celular";
import { RecursoCarroResponseDTO } from '../../entities/recursoCarroResponseDTO.model';
import { CardRecursoCarro } from "../../recursos/recurso-carro/card-recurso-carro/card-recurso-carro";
import { CadastroRecursoCarro } from '../../recursos/recurso-carro/cadastro-recurso-carro/cadastro-recurso-carro';

@Component({
  selector: 'app-detalhes-pessoa',
  imports: [CommonModule, RouterLink, CadastroVaga, ScrollOnRenderDirective, CardVaga, CardRecursoCelular, CadastroRecursoCelular, CardRecursoCarro, CadastroRecursoCarro],
  templateUrl: './detalhes-pessoa.html',
  styleUrl: './detalhes-pessoa.css'
})
export class DetalhesPessoa implements OnInit {

  private pessoaService = inject(PessoaService);
  private vagaService = inject(VagaService);
  private dataService = inject(DataService);
  private recursoService = inject(RecursoService);
  private cdr = inject(ChangeDetectorRef);

  pessoaId = input<string | null>(null);
  errorMessage: string | null = null;
  pessoa: PessoaFormData | null = null;
  vagasPessoa = signal<VagaFormData[] | null>(null);
  editVaga = signal<VagaFormData | null>(null);
  editRecursoCelular = signal<RecursoCelularResponseDTO | null>(null);
  editRecursoCarro = signal<RecursoCarroResponseDTO | null>(null);
  showRegistrarVaga = signal<boolean>(false);
  showRegistrarRecursoCelular = signal<boolean>(false);
  showRegistrarRecursoCarro = signal<boolean>(false);
  celularesList = signal<RecursoCelularResponseDTO[] | null>(null);
  carrosList = signal<RecursoCarroResponseDTO[] | null>(null);

  ngOnInit() {
    const id = this.pessoaId();
    if (id && !isNaN(Number(id))) {
      this.updateComponent();
    } else {
      this.errorMessage = 'Id inválido.'
    }
  }

  convertDatesToBr() {
    if (!this.pessoa) return;

    const d = this.dataService;

    this.pessoa.dataNascimento = d.convertISOToDateBR(this.pessoa.dataNascimento);
    this.pessoa.dataEmissaoCtps = d.convertISOToDateBR(this.pessoa.dataEmissaoCtps);
    this.pessoa.dataEmissaoRg = d.convertISOToDateBR(this.pessoa.dataEmissaoRg);
    this.pessoa.dataEmissaoPis = d.convertISOToDateBR(this.pessoa.dataEmissaoPis);
    this.pessoa.validadeCnh = d.convertISOToDateBR(this.pessoa.validadeCnh);
  }

  toggleRegistrarVaga() {
    this.handleOnlyClose();
    this.editVaga.set(null);
    this.showRegistrarVaga.set(!this.showRegistrarVaga());
    this.cdr.detectChanges();
  }

  toggleRegistrarCelular() {
    this.handleOnlyClose();
    this.editRecursoCelular.set(null);
    this.showRegistrarRecursoCelular.set(!this.showRegistrarRecursoCelular());
    this.cdr.detectChanges();
  }

  toggleRegistrarCarro() {
    this.handleOnlyClose();
    this.editRecursoCarro.set(null);
    this.showRegistrarRecursoCarro.set(!this.showRegistrarRecursoCarro());
    this.cdr.detectChanges();
  }

  editarVaga(event: any) {
    this.toggleRegistrarVaga();
    let vaga = this.vagasPessoa()?.find(v => v.id === event);
    if (vaga) {
      this.editVaga.set(vaga);
    }
  }

  editarRecursoCelular(event: any) {
    this.toggleRegistrarCelular();
    let recurso = this.celularesList()?.find(r => Number(r.id) === +event);
    if(recurso) {
      this.editRecursoCelular.set(recurso);
    }
  }

  editarRecursoCarro(event: any) {
    this.toggleRegistrarCarro();
    let recurso = this.carrosList()?.find(r => Number(r.id) === +event);
    if(recurso) {
      this.editRecursoCarro.set(recurso);
    }
  }

  handleUpdateAndClose() {
    this.updateComponent();

    this.handleOnlyClose();
  }

  updateComponent() {
    const id = this.pessoaId();
    this.pessoaService.buscarPessoa(Number(id)).subscribe(data => {
      this.pessoa = data;
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
  }

  handleOnlyClose() {
    this.showRegistrarVaga.set(false);
    this.showRegistrarRecursoCelular.set(false);
    this.showRegistrarRecursoCarro.set(false);
  }
}
