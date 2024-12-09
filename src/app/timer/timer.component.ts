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

  timerId: any; // Pour stocker l'ID du setInterval
  instructionId: any; // Pour l'instruction répétée

  // Configuration des instructions
  instructionInterval = 5; // Intervalle par défaut (toutes les 10 secondes)
  instructionMaxValue = 10; // Valeur max du chiffre prononcé
  instructionMinValue = 1; // Valeur min du chiffre prononcé
  private instructionTimer: any;    // Timer pour les instructions orales
  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: string = ''; // ID ou nom de la voix sélectionnée

  ngOnInit() {
    this.loadVoices();
    // Écoute les événements de chargement des voix si elles ne sont pas disponibles immédiatement
    window.speechSynthesis.onvoiceschanged = () => {
      this.loadVoices();
    };
  }

  private loadVoices() {
    this.availableVoices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('fr-FR'))
      .sort((a, b) => a.name.localeCompare(b.name)); // Ne garder que les voix françaises & ordre alphabétique;
    if (this.availableVoices.length > 0 && !this.selectedVoice) {
      this.selectedVoice = this.availableVoices[0].name; // Par défaut, sélectionne la première voix
    }
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
    this.resetTimer();
    this.isRunning = true;
    this.isPaused = false;
    this.currentRound = 1;
    this.currentPhase = 'Active';
    this.timeLeft = this.activeTime;
    this.runTimer();
    this.startInstructionTimer();
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
