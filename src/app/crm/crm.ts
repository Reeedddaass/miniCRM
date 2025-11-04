import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private fb: FormBuilder) {
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

  get contacts(): FormArray<FormGroup> {
    return this.form.get('contacts') as FormArray<FormGroup>;
  }

  createContactGroup(): FormGroup {
    return this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      position: this.fb.control(null),
      phone: this.fb.control(null, [Validators.pattern(/^\+\d{10,12}$/)]),
    });
  }

  addContact(): void {
    this.contacts.push(this.createContactGroup());
  }

  removeContact(i: number): void {
    if (this.contacts.length > 1) this.contacts.removeAt(i);
  }

  register(): void {
    if (this.form.valid) {
      console.log('Company registration payload:', this.form.value);
      this.form.reset();
      this.contacts.clear();
      this.addContact();
    } else {
      this.form.markAllAsTouched();
    }
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
    const value = control.value as string | null | undefined;
    if (!value) return null;
    return pattern.test(value) ? null : { vatFormat: true };
  };
}