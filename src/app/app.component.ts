import { Component } from '@angular/core';
import { TimerComponent } from './timer/timer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Boxing Timer App</h1>
    <app-timer></app-timer>
  `,
  imports: [TimerComponent],
  // styleUrls: ['./app.component.css']
})
export class AppComponent {}
