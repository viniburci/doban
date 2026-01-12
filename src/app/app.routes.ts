import { Routes } from '@angular/router';
import { CadastroPessoa } from './pessoa/cadastro-pessoa/cadastro-pessoa';
import { DetalhesPessoa } from './pessoa/detalhes-pessoa/detalhes-pessoa';
import { ListaPessoa } from './pessoa/lista-pessoa/lista-pessoa';
import { CadastroCarro } from './recursos/carro/cadastro-carro/cadastro-carro';
import { DetalhesCarro } from './recursos/carro/detalhes-carro/detalhes-carro';
import { ListaCarro } from './recursos/carro/lista-carro/lista-carro';
import { CadastroCelular } from './recursos/celular/cadastro-celular/cadastro-celular';
import { DetalhesCelular } from './recursos/celular/detalhes-celular/detalhes-celular';
import { ListaCelular } from './recursos/celular/lista-celular/lista-celular';
import { RecursoCarro } from './recursos/recurso-carro/recurso-carro';
import { RecursoCelular } from './recursos/recurso-celular/recurso-celular';
import { CadastroRocadeira } from './recursos/rocadeira/cadastro-rocadeira/cadastro-rocadeira';
import { DetalhesRocadeira } from './recursos/rocadeira/detalhes-rocadeira/detalhes-rocadeira';
import { ListaRocadeira } from './recursos/rocadeira/lista-rocadeira/lista-rocadeira';
import { RecursoRocadeira } from './recursos/recurso-rocadeira/recurso-rocadeira';
import { LoginComponent } from './auth/login.component';
import { CallbackComponent } from './auth/callback.component';
import { authGuard, loginGuard } from './services/auth.guard';

// Tipos de Recurso (dinâmico)
import { ListaTipoRecurso } from './recursos/tipo-recurso/lista-tipo-recurso/lista-tipo-recurso';
import { CadastroTipoRecurso } from './recursos/tipo-recurso/cadastro-tipo-recurso/cadastro-tipo-recurso';
import { DetalhesTipoRecurso } from './recursos/tipo-recurso/detalhes-tipo-recurso/detalhes-tipo-recurso';

// Itens Dinâmicos
import { ListaItemDinamico } from './recursos/item-dinamico/lista-item-dinamico/lista-item-dinamico';
import { CadastroItemDinamico } from './recursos/item-dinamico/cadastro-item-dinamico/cadastro-item-dinamico';
import { DetalhesItemDinamico } from './recursos/item-dinamico/detalhes-item-dinamico/detalhes-item-dinamico';

// Empréstimos Dinâmicos
import { ListaRecursoDinamico } from './recursos/recurso-dinamico/lista-recurso-dinamico/lista-recurso-dinamico';
import { CadastroRecursoDinamico } from './recursos/recurso-dinamico/cadastro-recurso-dinamico/cadastro-recurso-dinamico';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'auth/callback',
        component: CallbackComponent
    },
    {
        path: 'pessoas',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'lista'
            },
            {
                path: 'lista',
                component: ListaPessoa
            },
            {
                path: ':pessoaId/detalhes',
                component: DetalhesPessoa
            },
            {
                path: 'novo',
                component: CadastroPessoa
            },
            {
                path: ':pessoaId/editar',
                component: CadastroPessoa
            }
        ]
    },
    {
        path: 'celulares',
        canActivate: [authGuard],
        children: [
            {
                path: 'lista',
                component: ListaCelular
            },
            {
                path: 'novo',
                component: CadastroCelular
            },
            {
                path: ':celularId/detalhes',
                component: DetalhesCelular
            },
            {
                path: ':celularId/editar',
                component: CadastroCelular
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'lista'
            }
        ]
    },
    {
        path: 'carros',
        canActivate: [authGuard],
        children: [
            {
                path: 'lista',
                component: ListaCarro
            },
            {
                path: 'novo',
                component: CadastroCarro
            },
            {
                path: ':carroId/detalhes',
                component: DetalhesCarro
            },
            {
                path: ':carroId/editar',
                component: CadastroCarro
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'lista'
            }
        ]
    },
    {
        path: 'rocadeiras',
        canActivate: [authGuard],
        children: [
            {
                path: 'lista',
                component: ListaRocadeira
            },
            {
                path: ':rocadeiraId/detalhes',
                component: DetalhesRocadeira
            },
            {
                path: 'novo',
                component: CadastroRocadeira
            },
            {
                path: ':rocadeiraId/editar',
                component: CadastroRocadeira
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'lista'
            }
        ]
    },
    // Tipos de Recurso (sistema dinâmico)
    {
        path: 'tipos-recurso',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ListaTipoRecurso
            },
            {
                path: 'novo',
                component: CadastroTipoRecurso
            },
            {
                path: ':tipoRecursoId/detalhes',
                component: DetalhesTipoRecurso
            },
            {
                path: ':tipoRecursoId/editar',
                component: CadastroTipoRecurso
            }
        ]
    },
    // Itens Dinâmicos
    {
        path: 'itens',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ListaItemDinamico
            },
            {
                path: 'novo',
                component: CadastroItemDinamico
            },
            {
                path: ':itemId/detalhes',
                component: DetalhesItemDinamico
            },
            {
                path: ':itemId/editar',
                component: CadastroItemDinamico
            }
        ]
    },
    // Empréstimos Dinâmicos
    {
        path: 'emprestimos',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ListaRecursoDinamico
            },
            {
                path: 'novo',
                component: CadastroRecursoDinamico
            }
        ]
    },
    // Rotas legadas (recursos antigos)
    {
        path: 'recursos',
        canActivate: [authGuard],
        children: [
            {
                path: 'celular',
                children: [
                    {
                        path: 'lista',
                        component: RecursoCelular
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'lista'
                    }
                ]
            },
            {
                path: 'carro',
                children: [
                    {
                        path: 'lista',
                        component: RecursoCarro
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'lista'
                    }
                ]
            },
            {
                path: 'rocadeira',
                children: [
                    {
                        path: 'lista',
                        component: RecursoRocadeira
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'lista'
                    }
                ]
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
