import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { ClockComponent } from "../clock/clock.component";
import { VoiceService } from '../../../app/shared/voices/voice.service';
import { InstructionsService } from '../../../app/shared/instructions/instructions.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSliderModule, MatButtonModule, MatIconModule, MatExpansionModule,
    MatTabsModule, ClockComponent],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements AfterViewInit {
  activeTime: number = 8; // Default: 3 minutes
  restTime: number = 8;   // Default: 1 minute
  rounds: number = 2;      // Default: 3 rounds

  // Timer state
  timeLeft: number = 0;
  currentRound: number = 0;
  isRunning: boolean = false;
  isPaused: boolean = false;
  currentPhase: 'Active' | 'Rest' = 'Active'; // Tracks current phase
  private timer: any;

  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: string | undefined | null; // ID ou nom de la voix sélectionnée
  defaultVoice: string = 'French (France)+Hugo';

  constructor(public voiceService: VoiceService, public instructionService: InstructionsService) { }

  ngAfterViewInit() {
    this.voiceService.loadVoices();
  }
  testVoice() {
    if (this.voiceService.selectedVoice) {
      this.voiceService.testVoice(this.voiceService.selectedVoice);
    }
  }

  // Start the boxing timer
  startBoxingTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.timeLeft = this.currentPhase === 'Active' ? this.activeTime : this.restTime;
    this.currentRound = 1;

    // Message vocal pour le début
    if (this.currentPhase === 'Active') {
      this.instructionService.speakInstruction(`Boxez !`);
      this.instructionService.startInstructionTimer(this.currentPhase);
    }

    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;

        // Décompte vocal pour les 5 dernières secondes de repos countdown
        if (this.currentPhase !== 'Active' && this.timeLeft <= 5 && this.timeLeft != 0) {
          this.instructionService.speakInstruction(this.timeLeft.toString());
        }
      } else {
        // Fin de phase
        if (this.currentPhase === 'Active') {
          this.currentPhase = 'Rest';
          this.timeLeft = this.restTime;
          // Arrêter le timer d'instructions quand on passe en phase de repos
          clearInterval(this.instructionService.instructionTimer);
          this.instructionService.speakInstruction(`Repos pendant ${this.restTime} secondes`);
        } else {
          if (this.currentRound < this.rounds) {
            this.currentPhase = 'Active';
            this.timeLeft = this.activeTime;
            this.currentRound++;
            this.instructionService.speakInstruction('Boxez !');
            this.instructionService.startInstructionTimer(this.currentPhase);
          } else if (this.currentRound == this.rounds) {
            this.instructionService.speakInstruction(' DING DING DING Workout Complete !');
            this.stopTimer();
          }
        }
      }
    }, 1000);
  }


  // Reset the timer
  resetTimer() {
    clearInterval(this.timer);
    clearInterval(this.instructionService.instructionTimer);
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
        this.instructionService.startInstructionTimer(this.currentPhase); // Restart instructions during Active phase
      } else {
        // End all rounds
        this.resetTimer();
        this.instructionService.speakInstruction('Workout Complete!');
        alert('Workout Complete!');
      }
    }
  }

  pauseTimer() {
    if (this.isRunning && !this.isPaused) {
      clearInterval(this.timer);
      clearInterval(this.instructionService.instructionTimer);
      this.isPaused = true;
    }
  }

  // Resume the timer
  resumeTimer() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.runTimer();
      this.instructionService.startInstructionTimer(this.currentPhase);
    }
  }

  // Stop the timer
  stopTimer() {
    this.resetTimer();
  }

}
