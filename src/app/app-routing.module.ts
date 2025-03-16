import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoinApiComponent } from './pages/coin-api/coin-api.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'coin-api',
        component: CoinApiComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
