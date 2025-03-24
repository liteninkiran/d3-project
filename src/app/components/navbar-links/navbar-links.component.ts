import { Component } from '@angular/core';

@Component({
    selector: 'app-navbar-links',
    templateUrl: './navbar-links.component.html',
    styleUrls: ['./navbar-links.component.scss'],
})
export class NavbarLinksComponent {

    public config: IConfig[] = [
        {
            link: '/home',
            icon: 'home',
            text: 'Home',
        },
        {
            link: '/coin-api',
            icon: 'currency_bitcoin',
            text: 'Coin API',
        },
        {
            link: '/nhs-api',
            icon: 'personal_injury',
            text: 'NHS API',
        },
    ]
}

interface IConfig {
    link: string,
    icon: string,
    text: string,
}
