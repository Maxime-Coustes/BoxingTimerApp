import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  activeTime: number = 180; // Default: 3 minutes
  restTime: number = 60;   // Default: 1 minute
  rounds: number = 3;      // Default: 3 rounds

  // Timer state
  timeLeft: number = 0;
  currentRound: number = 0;
  isRunning: boolean = false;
  isPaused: boolean = false;
  currentPhase: 'Active' | 'Rest' = 'Active'; // Tracks current phase
  private timer: any;


  // Start the boxing timer
  startBoxingTimer() {
    this.resetTimer();
    this.isRunning = true;
    this.isPaused = false;
    this.currentRound = 1;
    this.currentPhase = 'Active';
    this.timeLeft = this.activeTime;
    this.runTimer();
  }

  // Reset the timer
  resetTimer() {
    clearInterval(this.timer);
    this.timeLeft = 0;
    this.currentRound = 0;
    this.isRunning = false;
    this.currentPhase = 'Active';
  }

  // Run the timer logic
  private runTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.handlePhaseChange();
      }
    }, 1000); // Tick every second
  }

  // Handle phase and round changes
  private handlePhaseChange() {
    if (this.currentPhase === 'Active') {
      // Switch to Rest phase
      this.currentPhase = 'Rest';
      this.timeLeft = this.restTime;
    } else {
      // End rest phase, check round
      if (this.currentRound < this.rounds) {
        this.currentPhase = 'Active';
        this.currentRound++;
        this.timeLeft = this.activeTime;
      } else {
        // End all rounds
        this.resetTimer();
        alert('Workout Complete!');
      }
    }
  }

  pauseTimer() {
    if (this.isRunning && !this.isPaused) {
      clearInterval(this.timer);
      this.isPaused = true;
    }
  }

  // Resume the timer
  resumeTimer() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.runTimer();
    }
  }

  // Stop the timer
  stopTimer() {
    this.resetTimer();
  }
}
