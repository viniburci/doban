import { Routes } from '@angular/router';
import { CadastroPessoa } from './cadastro-pessoa/cadastro-pessoa';
import { PessoasPage } from './pessoa/pessoas-page/pessoas-page';

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
                component: PessoasPage
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
