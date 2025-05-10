import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarLinksComponent } from './components/navbar-links/navbar-links.component';
import { MaterialModule } from './modules/material.module';
import { NhsApiModule } from './components/nhs-api/nhs-api.module';
import { ScratchComponent } from './pages/scratch/scratch.component';
import { D3ChartsModule } from './components/d3/d3-charts.module';
import { EpdComponent } from './pages/epd/epd.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarLinksComponent,
        ScratchComponent,
        EpdComponent,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        NhsApiModule,
        D3ChartsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
