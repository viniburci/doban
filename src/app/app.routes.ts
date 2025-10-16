import { Routes } from '@angular/router';
import { CadastroPessoa } from './cadastro-pessoa/cadastro-pessoa';

export const routes: Routes = [
    {
        path: 'pessoa',
        component: CadastroPessoa,
        children: [
            {
                path: 'criar',
                component: CadastroPessoa
            },
            {
                path: '', 
                pathMatch: 'full',  
                redirectTo: 'criar'
            }
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pessoa'
    },
    {
        path: '**',
        redirectTo: '' 
    }
];
