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

 /**
  * Charge les voix disponibles après l'initialisation du composant.
  */
  ngAfterViewInit() {
    this.voiceService.loadVoices();
  }
  /**
   * Teste la voix actuellement sélectionnée dans le service vocal.
   */
  testVoice() {
    if (this.voiceService.selectedVoice) {
      this.voiceService.testVoice(this.voiceService.selectedVoice);
    }
  }

  /**
   * Démarre le timer de boxe.
   * Initialise les paramètres et lance le décompte.
   */
  startBoxingTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.timeLeft = this.getPhaseDuration(); // Initialise le temps restant pour la phase actuelle
    this.currentRound = 1; // Commence au premier round

    this.playPhaseStart(); // Joue les instructions vocales pour le début
    this.startTimer(); // Lance le décompte principal
  }

  /**
   * Réinitialise le timer à ses paramètres par défaut.
   * Arrête les timers en cours et réinitialise les variables d'état.
   */
  resetTimer() {
    this.stopTimers();
    this.timeLeft = 0;
    this.currentRound = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.currentPhase = 'Active';
  }

  /**
   * Met le timer en pause si celui-ci est en cours d'exécution.
   */
  pauseTimer() {
    if (this.isRunning && !this.isPaused) {
      this.stopTimers(); // Arrête tous les timers
      this.isPaused = true;
    }
  }

  /**
   * Reprend le timer si celui-ci était en pause.
   */
  resumeTimer() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.startTimer(); // Relance le décompte principal
    }
  }

  /**
   * Arrête complètement le timer en cours.
   */
  stopTimer() {
    this.resetTimer();
  }

  /**
   * Démarre le décompte principal du timer.
   * Diminue `timeLeft` chaque seconde et gère les transitions entre phases.
   */
  private startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;

        // Instructions vocales pour les 5 dernières secondes de repos
        if (this.isRestPhase() && this.timeLeft <= 5 && this.timeLeft > 0) {
          this.instructionService.speakInstruction(this.timeLeft.toString());
        }
      } else {
        this.handlePhaseChange(); // Change de phase ou termine l'entraînement
      }
    }, 1000);
  }

  /**
   * Gère les transitions entre phases (active/rest) et les rounds.
   */
  private handlePhaseChange() {
    if (this.isActivePhase()) {
      this.switchToRestPhase(); // Passe à la phase de repos
    } else if (this.currentRound < this.rounds) {
      this.switchToActivePhase(); // Passe à la phase active pour le prochain round
    } else {
      this.endWorkout(); // Termine l'entraînement après le dernier round
    }
  }

  /**
   * Passe à la phase active et prépare les paramètres correspondants.
   */
  private switchToActivePhase() {
    this.currentPhase = 'Active';
    this.currentRound++;
    this.timeLeft = this.activeTime;
    this.playPhaseStart();
  }

  /**
   * Passe à la phase de repos et joue les instructions vocales associées.
   */
  private switchToRestPhase() {
    this.currentPhase = 'Rest';
    this.timeLeft = this.restTime;
    this.stopInstructionTimer(); // Arrête le timer d'instructions
    this.instructionService.speakInstruction(`Repos pendant ${this.restTime} secondes`);
  }

  /**
   * Termine l'entraînement et joue un message vocal final.
   */
  private endWorkout() {
    this.instructionService.speakInstruction('DING DING DING Entrainement terminé!');
    this.stopTimer(); // Réinitialise le timer
  }

  /**
   * Joue les instructions vocales pour le début d'une nouvelle phase.
   */
  private playPhaseStart() {
    const message = this.isActivePhase() ? 'Boxez !' : `Repos pendant ${this.restTime} secondes`;
    this.instructionService.speakInstruction(message);

    if (this.isActivePhase()) {
      this.instructionService.startInstructionTimer(this.currentPhase);
    }
  }

  /**
   * Arrête tous les timers actifs, y compris le timer principal et celui des instructions.
   */
  private stopTimers() {
    clearInterval(this.timer);
    this.stopInstructionTimer();
  }

  /**
   * Arrête uniquement le timer des instructions vocales.
   */
  private stopInstructionTimer() {
    clearInterval(this.instructionService.instructionTimer);
  }

  /**
   * Retourne la durée de la phase actuelle (active ou repos).
   */
  private getPhaseDuration(): number {
    return this.isActivePhase() ? this.activeTime : this.restTime;
  }

  /**
   * Vérifie si la phase actuelle est active.
   */
  private isActivePhase(): boolean {
    return this.currentPhase === 'Active';
  }

  /**
   * Vérifie si la phase actuelle est une phase de repos.
   */
  private isRestPhase(): boolean {
    return this.currentPhase === 'Rest';
  }

}
