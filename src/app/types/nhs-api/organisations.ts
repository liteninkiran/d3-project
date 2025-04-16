export type OrganisationResult = {
    Organisations: Organisations[];
}

export type Organisations = {
    Name: string;
    OrgId: string;
    Status: string;
    OrgRecordClass: string;
    PostCode: string;
    LastChangeDate: string;
    PrimaryRoleId: string;
    PrimaryRoleDescription: string;
    OrgLink: string;
}
