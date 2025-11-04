import { Component, signal } from '@angular/core';
import { Crm } from "./crm/crm";

@Component({
  selector: 'app-root',
  imports: [Crm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('miniCRM');
}
