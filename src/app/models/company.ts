export interface ContactModel {
  firstName: string;
  lastName: string;
  position?: string | null;
  phone?: string | null;
}

export interface CompanyModel {
  companyName: string;
  companyCode?: string | null;
  vatCode?: string | null;
  address?: string | null;
  email: string;
  phone?: string | null;
  contacts: ContactModel[];
}