import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {

  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: string | null = null;
  defaultVoice: string = 'French (France)+Hugo';

  constructor() {
    this.loadVoices();
  }

  public loadVoices() {
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
    } else {
      console.error('Speech synthesis not available or window is undefined');
    }
  }

  testVoice(voiceName: string) {
    const utterance = new SpeechSynthesisUtterance('Bonjour, je suis votre assistant virtuel. 1, 3, 2, 5, 4');
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

}
