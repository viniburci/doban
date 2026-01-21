import { Routes } from '@angular/router';
import { CadastroPessoa } from './pessoa/cadastro-pessoa/cadastro-pessoa';
import { DetalhesPessoa } from './pessoa/detalhes-pessoa/detalhes-pessoa';
import { ListaPessoa } from './pessoa/lista-pessoa/lista-pessoa';
import { LoginComponent } from './auth/login.component';
import { CallbackComponent } from './auth/callback.component';
import { authGuard, loginGuard } from './services/auth.guard';
import { ListaTipoRecurso } from './recursos/tipo-recurso/lista-tipo-recurso/lista-tipo-recurso';
import { CadastroTipoRecurso } from './recursos/tipo-recurso/cadastro-tipo-recurso/cadastro-tipo-recurso';
import { DetalhesTipoRecurso } from './recursos/tipo-recurso/detalhes-tipo-recurso/detalhes-tipo-recurso';
import { ListaItemDinamico } from './recursos/item-dinamico/lista-item-dinamico/lista-item-dinamico';
import { CadastroItemDinamico } from './recursos/item-dinamico/cadastro-item-dinamico/cadastro-item-dinamico';
import { DetalhesItemDinamico } from './recursos/item-dinamico/detalhes-item-dinamico/detalhes-item-dinamico';
import { ListaRecursoDinamico } from './recursos/recurso-dinamico/lista-recurso-dinamico/lista-recurso-dinamico';
import { CadastroRecursoDinamico } from './recursos/recurso-dinamico/cadastro-recurso-dinamico/cadastro-recurso-dinamico';
import { GestaoClientes } from './cliente/gestao-clientes';
import { GestaoTemplates } from './documentos/gestao-templates/gestao-templates';
import { FormTemplate } from './documentos/form-template/form-template';
import { DetalhesTemplate } from './documentos/detalhes-template/detalhes-template';

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
    // Gestão de Clientes
    {
        path: 'clientes',
        canActivate: [authGuard],
        component: GestaoClientes
    },
    // Templates de Documentos
    {
        path: 'templates-documento',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: GestaoTemplates
            },
            {
                path: 'novo',
                component: FormTemplate
            },
            {
                path: ':templateId/detalhes',
                component: DetalhesTemplate
            },
            {
                path: ':templateId/editar',
                component: FormTemplate
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];
