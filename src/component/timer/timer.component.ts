import { Component, AfterViewInit, ChangeDetectorRef, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSliderModule, MatButtonModule, MatIconModule, MatExpansionModule,
    MatTabsModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements AfterViewInit {

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

  timerId: any; // Pour stocker l'ID du setInterval
  instructionId: any; // Pour l'instruction répétée

  // Configuration des instructions
  instructionInterval = 3; // Intervalle par défaut (toutes les 10 secondes)
  instructionMinValue = 1; // Valeur min du chiffre prononcé
  instructionMaxValue = 6; // Valeur max du chiffre prononcé
  private instructionTimer: any;    // Timer pour les instructions orales
  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: string | undefined | null; // ID ou nom de la voix sélectionnée
  defaultVoice: string = 'French (France)+Hugo';
  totalTime: number = 0;
  noInstructions: boolean = false; // Désactiver les instructions si true

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.loadVoices();
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.availableVoices = window.speechSynthesis.getVoices()
        .filter(voice => voice.lang.startsWith('fr-FR'))
        .sort((a, b) => a.name.localeCompare(b.name));

      const userAgent = navigator.userAgent;
      const isFirefox = userAgent.includes('Firefox');
      const isChrome = userAgent.includes('Chrome') || userAgent.includes('Chromium');

      if (this.availableVoices.length > 0 && !this.selectedVoice) {
        if (isFirefox) {
          this.selectedVoice = this.defaultVoice
            ? this.defaultVoice
            : this.availableVoices[0].name;
        } else if (isChrome) {
          ;
          // Appliquer la voix par défaut uniquement
          this.selectedVoice = this.defaultVoice || '';
        } else {
          // Pour les autres navigateurs, utiliser une stratégie de fallback
          this.selectedVoice = this.availableVoices[0].name;
        }
      }

      // Notifie Angular des modifications
      this.cdr.detectChanges();
    } else {
      console.error('Speech synthesis not available or window is undefined');
    }
  }

  calculateCircleOffset(): number {
    const totalTime = this.totalTime || 1; // Éviter la division par zéro
    return ((totalTime - this.timeLeft) / totalTime) * 100; // Proportion de temps écoulé
  }


  testVoice(voiceName: string) {
    const utterance = new SpeechSynthesisUtterance('Bonjour, je suis votre assistant virtuel. 1, 3, 2, 5, 4');
    // French (France)+Hugo (fr-FR) 
    // Trouver la voix sélectionnée par son nom
    const selectedVoice = this.availableVoices.find(v => v.name === voiceName);

    if (selectedVoice) {
      utterance.voice = selectedVoice; // Appliquer la voix sélectionnée
    }
    // Ajuster les paramètres de la voix
    utterance.rate = 0.95; // Vitesse normale
    utterance.pitch = 0.85; // Tonalité normale
    utterance.volume = 1; // Volume maximum

    window.speechSynthesis.speak(utterance); // Lancer la synthèse vocale
  }


  // Start the boxing timer
  startBoxingTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.timeLeft = this.currentPhase === 'Active' ? this.activeTime : this.restTime;
    this.currentRound = 1;

    // Message vocal pour le début
    if (this.currentPhase === 'Active') {
      this.speakInstruction(`Boxez !`);
    }

    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;

        // Décompte vocal pour les 5 dernières secondes de repos
        if (this.timeLeft <= 5 && this.timeLeft != 0) {
          this.speakInstruction(this.timeLeft.toString());
        }
      } else {
        // Fin de phase
        if (this.currentPhase === 'Active') {
          this.currentPhase = 'Rest';
          this.timeLeft = this.restTime;
          this.speakInstruction(`Repos pendant ${this.restTime} secondes`);
        } else {
          if (this.currentRound < this.rounds) {
            this.currentPhase = 'Active';
            this.timeLeft = this.activeTime;
            this.currentRound++;
            this.speakInstruction('Boxez !');
          } else {
            this.stopTimer();
          }
        }
      }
    }, 1000);
  }


  // Reset the timer
  resetTimer() {
    clearInterval(this.timer);
    clearInterval(this.instructionTimer);
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
        this.startInstructionTimer(); // Restart instructions during Active phase
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
      clearInterval(this.instructionTimer);
      this.isPaused = true;
    }
  }

  // Resume the timer
  resumeTimer() {
    if (this.isRunning && this.isPaused) {
      this.isPaused = false;
      this.runTimer();
      this.startInstructionTimer();
    }
  }

  // Stop the timer
  stopTimer() {
    this.resetTimer();
  }

  // Start the instruction timer
  private startInstructionTimer() {
    if (this.noInstructions) {
      clearInterval(this.instructionId); // Arrête les instructions si désactivées
      return;
    }
    this.instructionTimer = setInterval(() => {
      if (this.currentPhase === 'Active') {
        const randomValue = Math.floor(
          Math.random() * (this.instructionMaxValue - this.instructionMinValue + 1)
        ) + this.instructionMinValue;
        this.speakInstruction(randomValue.toString());
      }
    }, this.instructionInterval * 1000);
  }

  // Use SpeechSynthesis to give oral instructions
  private speakInstruction(text: string) {
    if (this.noInstructions) {
      return; // Ne joue aucune instruction si "Aucune instruction" est activée
    }
    const utterance = new SpeechSynthesisUtterance(text);

    // Définit la voix si elle est sélectionnée
    const voice = this.availableVoices.find(v => v.name === this.selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    // Parle
    window.speechSynthesis.speak(utterance);
  }

}
