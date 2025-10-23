import { Routes } from '@angular/router';
import { CadastroPessoa } from './pessoa/cadastro-pessoa/cadastro-pessoa';
import { ListaPessoa } from './pessoa/lista-pessoa/lista-pessoa';
import { DetalhesPessoa } from './pessoa/detalhes-pessoa/detalhes-pessoa';
import { RecursoCelular } from './recursos/recurso-celular/recurso-celular';
import { RecursoCarro } from './recursos/recurso-carro/recurso-carro';
import { CadastroCelular } from './recursos/celular/cadastro-celular/cadastro-celular';
import { CadastroCarro } from './recursos/carro/cadastro-carro/cadastro-carro';
import { ListaCarro } from './recursos/carro/lista-carro/lista-carro';
import { DetalhesCarro } from './recursos/carro/detalhes-carro/detalhes-carro';
import { ListaCelular } from './recursos/celular/lista-celular/lista-celular';
import { DetalhesCelular } from './recursos/celular/detalhes-celular/detalhes-celular';
import { CadastroVaga } from './vaga/cadastro-vaga/cadastro-vaga';

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
        path: 'recursos',
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
