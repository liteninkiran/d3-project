import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NhsApiComponent } from './pages/nhs-api/nhs-api.component';
import { ScratchComponent } from './pages/scratch/scratch.component';
import { Scratch2Component } from './pages/scratch2/scratch2.component';
import { Scratch3Component } from './pages/scratch3/scratch3.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'nhs-api',
        component: NhsApiComponent,
    },
    {
        path: 'scratch',
        component: ScratchComponent,
    },
    {
        path: 'scratch2',
        component: Scratch2Component,
    },
    {
        path: 'scratch3',
        component: Scratch3Component,
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
