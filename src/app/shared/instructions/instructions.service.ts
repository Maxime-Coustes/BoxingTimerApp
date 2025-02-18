import { Injectable } from '@angular/core';
import { VoiceService } from '../voices/voice.service';

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {

  noInstructions: boolean = false; // Désactiver les instructions si true
  instructionId: any; // Pour l'instruction répétée
  // Configuration des instructions
  instructionInterval = 3; // Intervalle par défaut (toutes les 10 secondes)
  instructionMinValue = 3; // Valeur min du chiffre prononcé
  instructionMaxValue = 6; // Valeur max du chiffre prononcé
  instructionTimer: any;    // Timer pour les instructions orales

  constructor(public voiceService: VoiceService) { }

  /**
   * 
   * @param currentPhase 
   * @returns void
   * Start the instruction timer 
   */
  public startInstructionTimer(currentPhase: string): void {
    if (this.noInstructions) {
      clearInterval(this.instructionId); // Arrête les instructions si désactivées
      return;
    }
    this.instructionTimer = setInterval(() => {
      if (currentPhase === 'Active') {
        const randomValue = Math.floor(
          Math.random() * (this.instructionMaxValue - this.instructionMinValue + 1)
        ) + this.instructionMinValue;
        this.speakInstruction(randomValue.toString());
      }
    }, this.instructionInterval * 1000);
  }

  /**
   * 
   * @param text 
   * @returns void
   * Use SpeechSynthesis to give oral instructions 
   */
  public speakInstruction(text: string): void {
    if (this.noInstructions) {
      return; // Ne joue aucune instruction si "Aucune instruction" est activée
    }
    const utterance = new SpeechSynthesisUtterance(text);

    // Définit la voix si elle est sélectionnée
    const voice = this.voiceService.availableVoices.find(v => v.name === this.voiceService.selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    // Parle
    window.speechSynthesis.speak(utterance);
  }

}
