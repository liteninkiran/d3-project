import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarLinksComponent } from './components/navbar-links/navbar-links.component';
import { MaterialModule } from './modules/material.module';
import { CoinApiModule } from './modules/coin-api.module';
import { NhsApiModule } from './modules/nhs-api.module';
import { ScratchComponent } from './pages/scratch/scratch.component';
import { D3ChartsModule } from './modules/d3-charts.module';

@NgModule({
    declarations: [
        AppComponent,
        NavbarLinksComponent,
        ScratchComponent,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        CoinApiModule,
        NhsApiModule,
        D3ChartsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
