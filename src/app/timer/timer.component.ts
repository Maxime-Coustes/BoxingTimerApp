import { Component } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  template: `
    <p>COUCOU TIMER !</p>
    <div class="timer">
      <h1>Time Left: {{ timeLeft }} seconds</h1>
      <button (click)="startTimer(10, 1000)">Start Timer</button>
      <button (click)="stopTimer()">Stop Timer</button>
    </div>
  `,
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  timeLeft = 10;
  timer: any;

  startTimer(duration: number, interval: number) {
    this.timeLeft = duration;
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
      }
    }, interval);
  }

  stopTimer() {
    clearInterval(this.timer);
  }
}
