import { Routes } from '@angular/router';
import { CadastroPessoa } from './pessoa/cadastro-pessoa/cadastro-pessoa';
import { ListaPessoa } from './pessoa/lista-pessoa/lista-pessoa';
import { DetalhesPessoa } from './pessoa/detalhes-pessoa/detalhes-pessoa';
import { RecursoCelular } from './recursos/recurso-celular/recurso-celular';
import { RecursoCarro } from './recursos/recurso-carro/recurso-carro';
import { CadastroCelular } from './recursos/celular/cadastro-celular/cadastro-celular';
import { CadastroCarro } from './recursos/carro/cadastro-carro/cadastro-carro';

export const routes: Routes = [
    {
        path: 'pessoas',
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
                path: 'criar',
                component: CadastroPessoa
            },
            {
                path: ':pessoaId/editar',
                component: CadastroPessoa
            }
        ]
    },
    {
        path: 'celular',
        children: [
            {
                path: 'criar',
                component: CadastroCelular
            },
            {
                path: ':celularId/editar',
                component: CadastroCelular
            }
        ]
    },
    {
        path: 'carro',
        children: [
            {
                path: 'criar',
                component: CadastroCarro
            },
            {
                path: ':carroId/editar',
                component: CadastroCarro
            }
        ]
    },
    {
        path: 'recurso',
        children: [
            {
                path: 'celular',
                children: [
                    {
                        path: 'lista',
                        component: RecursoCelular
                    }
                ]
            },
            {
                path: 'carro',
                children: [
                    {
                        path: 'lista',
                        component: RecursoCarro
                    }
                ]
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pessoas'
    }
];
