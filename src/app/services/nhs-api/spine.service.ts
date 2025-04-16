import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { expand, map, toArray } from 'rxjs/operators';
import { OrganisationResult } from 'src/app/types/nhs-api/organisations';

@Injectable({ providedIn: 'root' })
export class SpineService {
    private readonly baseUrl = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations';
    private readonly limit = 1000;

    constructor(private http: HttpClient) { }

    public fetchAllOrganisations(primaryRoleId: string) {
        let offset = 1;

        return this.fetchPage(offset, primaryRoleId).pipe(
            expand((organisations, i) => {
                const nextOffset = offset + this.limit * (i + 1);
                return organisations.length < this.limit ? EMPTY : this.fetchPage(nextOffset, primaryRoleId);
            }),
            toArray(),
            map((pages) => pages.flat())
        );
    }

    private fetchPage(offset: number, primaryRoleId: string) {
        const url = `${this.baseUrl}?Limit=${this.limit}&Offset=${offset}&PrimaryRoleId=${primaryRoleId}`;
        return this.http.get<OrganisationResult>(url).pipe(
            map((res) => res.Organisations || [])
        );
    }
}
