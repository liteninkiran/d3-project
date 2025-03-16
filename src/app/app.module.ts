import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarLinksComponent } from './components/navbar-links/navbar-links.component';
import { MaterialModule } from './modules/material.module';
import { CoinApiModule } from './modules/coin-api.module';

@NgModule({
    declarations: [
        AppComponent,
        NavbarLinksComponent,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        CoinApiModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
