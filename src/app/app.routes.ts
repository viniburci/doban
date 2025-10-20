import { Routes } from '@angular/router';
import { CadastroPessoa } from './pessoa/cadastro-pessoa/cadastro-pessoa';
import { ListaPessoa } from './pessoa/lista-pessoa/lista-pessoa';
import { DetalhesPessoa } from './pessoa/detalhes-pessoa/detalhes-pessoa';

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
        path: '',
        pathMatch: 'full',
        redirectTo: 'pessoas'
    }
];
