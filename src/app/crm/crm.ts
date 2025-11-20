import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../services/company';
import { CompanyModel } from '../models/company';
import { catchError, of, tap } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-crm',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crm.html',
  styleUrl: './crm.css',
})
export class Crm {
  form: FormGroup;

  loading = true;
  saving = false;
  companies: any[] = [];
  errorMsg: string | null = null;
  successMsg: string | null = null;

  constructor(private fb: FormBuilder, private CompanyService: CompanyService) {
    this.form = this.fb.group({
      companyName: this.fb.control('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ]),
      companyCode: this.fb.control(null, [Validators.pattern(/^\d+$/)]),
      vatCode: this.fb.control(null, [vatCodeValidator()]),
      address: this.fb.control(null),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control(null, [Validators.pattern(/^\+\d{10,12}$/)]),
      contacts: this.fb.array([this.createContactGroup()]),
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.errorMsg = null;

    this.CompanyService.getCompanies()
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
          console.error(err);
          this.loading = false;
          this.errorMsg = 'Nepavyko įkelti duomenų.';
          return of([]);
        })
      )
      .subscribe(data => this.companies = data);
  }

  get contacts(): FormArray<FormGroup> {
    return this.form.get('contacts') as FormArray<FormGroup>;
  }

  createContactGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: [null],
      phone: [null, Validators.pattern(/^\+\d{10,12}$/)],
    });
  }

  addContact(): void {
    this.contacts.push(this.createContactGroup());
  }

  removeContact(i: number): void {
    if (this.contacts.length > 1) this.contacts.removeAt(i);
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.successMsg = null;
    this.errorMsg = null;

    const data = this.form.value as CompanyModel;

    this.CompanyService.addCompany(data)
      .pipe(
        tap(() => this.saving = false),
        catchError(err => {
          console.error(err);
          this.saving = false;
          this.errorMsg = 'Nepavyko išsaugoti duomenų';
          return of(null);
        })
      )
      .subscribe(result => {
        if (!result) return;

        this.successMsg = 'Įmonė sėkmingai išsaugota';
        this.form.reset();
        this.contacts.clear();
        this.addContact();
        this.loadCompanies();
      });
  }

  control(path: string): AbstractControl | null {
    return this.form.get(path);
  }

  contactControl(i: number, key: string): AbstractControl {
    return (this.contacts.at(i) as FormGroup).get(key)!;
  }
}

export function vatCodeValidator() {
  const pattern = /^(LT)?\d+$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return pattern.test(value) ? null : { vatFormat: true };
  };
}