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
            link: '/nhs-api',
            icon: 'personal_injury',
            text: 'NHS API',
        },
        {
            link: '/scratch',
            icon: 'construction',
            text: 'Scratch',
        },
        {
            link: '/epd',
            icon: 'personal_injury',
            text: 'Prescribing Data',
        },
    ]
}

interface IConfig {
    link: string,
    icon: string,
    text: string,
}
