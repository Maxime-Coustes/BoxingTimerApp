import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from '../clock/clock.component';

@Component({
  selector: 'tabata',
  imports: [CommonModule, ClockComponent],
  templateUrl: './tabata.component.html',
  styleUrls: ['./tabata.component.css'],
})
export class TabataComponent {

  tabataSequence = [
    {
      id: 'Échauffement 1 sur 2', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', duration: 5 },
        { type: 'rest', duration: 3 },
      ],
    },
    {
      id: 'Échauffement 2 sur 2', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', duration: 5 },
        { type: 'rest', duration: 3 },
      ],
    },
    {
      id: 'Tabata vitesse 1 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active', duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Tabata vitesse 2 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active', duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Tabata vitesse 3 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active', duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Tabata vitesse 4 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active', duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Puissance 1 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Puissance 2 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Puissance 3 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Puissance 4 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Cooldown 3 minutes', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', duration: 180 },
        { type: 'rest', duration: 0 }, // fin du workout
      ],
      // endRest: 0, // Repos final après tous les rounds de cette phase
    },
  ];

  currentPhaseIndex = 0; // Phase actuelle
  currentRound = 1; // Round actuel
  currentSubPhaseIndex = 0; // Sous-phase actuelle (active ou repos)
  remainingTime = 0; // Temps restant
  timer: any; // Référence pour le setInterval

  // Démarre le timer
  startTabata() {
    const currentPhase = this.tabataSequence[this.currentPhaseIndex];
    const currentSubPhase = currentPhase.phases[this.currentSubPhaseIndex];

    this.remainingTime = currentSubPhase.duration;

    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.moveToNextSubPhaseOrRound();
      }
    }, 1000);
  }

  // Arrête le timer
  stopTabata() {
    clearInterval(this.timer);
  }

  // Passe à la sous-phase suivante, ou au round suivant, ou à la phase suivante
  moveToNextSubPhaseOrRound() {
    const currentPhase = this.tabataSequence[this.currentPhaseIndex];

    if (this.currentSubPhaseIndex < currentPhase.phases.length - 1) {
      // Passe à la sous-phase suivante
      this.currentSubPhaseIndex++;
      this.remainingTime = currentPhase.phases[this.currentSubPhaseIndex].duration;
    } else if (this.currentRound < currentPhase.rounds) {
      // Passe au round suivant
      this.currentRound++;
      this.currentSubPhaseIndex = 0; // Recommence à la première sous-phase
      this.remainingTime = currentPhase.phases[this.currentSubPhaseIndex].duration;
    } else if (currentPhase.endRest) {
      // Gère le repos final après la phase
      this.remainingTime = currentPhase.endRest;
      delete (currentPhase as any).endRest; // Repos final traité, on le supprime
    } else {
      // Passe à la phase suivante
      this.moveToNextPhase();
    }
  }

  // Passe à la phase suivante
  moveToNextPhase() {
    if (this.currentPhaseIndex < this.tabataSequence.length - 1) {
      this.currentPhaseIndex++;
      this.currentRound = 1;
      this.currentSubPhaseIndex = 0;
      const nextPhase = this.tabataSequence[this.currentPhaseIndex];
      this.remainingTime = nextPhase.phases[this.currentSubPhaseIndex].duration;
    } else {
      // Fin de la séquence Tabata
      this.stopTabata();
      alert('Séquence terminée !');
    }
  }
}

