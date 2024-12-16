import { Component } from '@angular/core';
import { TimerComponent } from '../src/component/timer/timer.component';

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
