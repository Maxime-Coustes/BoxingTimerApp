import { Component } from '@angular/core';
import { TimerComponent } from '../feature/timer/timer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-timer></app-timer>
  `,
  imports: [TimerComponent],
  // styleUrls: ['./app.component.css']
})
export class AppComponent {}
