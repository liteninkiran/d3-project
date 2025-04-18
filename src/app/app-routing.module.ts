import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NhsApiComponent } from './pages/nhs-api/nhs-api.component';
import { ScratchComponent } from './pages/scratch/scratch.component';

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
        path: '**',
        redirectTo: 'home',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
