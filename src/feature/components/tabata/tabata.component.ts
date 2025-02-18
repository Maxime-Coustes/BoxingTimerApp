import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from '../clock/clock.component';
import { InstructionsService } from '../../../app/shared/instructions/instructions.service';

@Component({
  selector: 'tabata',
  imports: [CommonModule, ClockComponent],
  templateUrl: './tabata.component.html',
  styleUrls: ['./tabata.component.css'],
})
export class TabataComponent {
  constructor(private instructionService: InstructionsService) { }

  tabataSequence = [
    {
      id: 'Échauffement 1 sur 2', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active', 
          description: 'On met l\'accent sur la technique sur le premier round', 
          duration: 180
        },
        { type: 'rest', duration: 60 },
      ],
    },
    {
      id: 'Échauffement 2 sur 2', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active',
          description: 'On ajoute quelques accélérations sur ce round pour être prêt au tabata.', 
          duration: 180 },
        { type: 'rest', duration: 60 },
      ],
    },
    {
      id: 'Tabata vitesse 1 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active',
          description: 'Focus vitesse, nombre de coups, garde haute tout le temps',
          duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Tabata vitesse 2 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active',
          description: 'Focus vitesse, nombre de coups, garde haute tout le temps',
           duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Tabata vitesse 3 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active',
          description: 'Focus vitesse, nombre de coups, garde haute tout le temps',
           duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Tabata vitesse 4 sur 4', // Identifiant pour cette phase
      rounds: 8,
      phases: [
        { type: 'active',
          description: 'Focus vitesse, nombre de coups, garde haute tout le temps',
           duration: 20 },
        { type: 'rest', duration: 10 },
      ],
      endRest: 60, // 1mn de repos après ce bloc
    },
    {
      id: 'Puissance 1 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active',
          description: 'Enchainements courts mais puissants, pour chaque coup.',
          duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Puissance 2 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active',
          description: 'Enchainements courts mais puissants, pour chaque coup.',
           duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Puissance 3 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active',
          description: 'Enchainements courts mais puissants, pour chaque coup.',
           duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Puissance 4 sur 4', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active',
          description: 'Enchainements courts mais puissants, pour chaque coup.',
           duration: 60 },
        { type: 'rest', duration: 30 },
      ],
    },
    {
      id: 'Cooldown 3 minutes', // Identifiant pour cette phase
      rounds: 1,
      phases: [
        { type: 'active',
          description: 'boxe light, pour que le cardio redescende.',
           duration: 180 },
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

    this.timer = setInterval(() => {
      // Récupère dynamiquement la sous-phase actuelle
      const currentSubPhase = currentPhase.phases[this.currentSubPhaseIndex];

      if (this.remainingTime > 0) {
        this.remainingTime--;

        // Décompte oral pour les 5 dernières secondes d'une phase de repos
        if (currentSubPhase.type === 'rest' && this.remainingTime <= 5) {
          console.log('REST during:', this.remainingTime); // Log pour vérifier
          this.instructionService.speakInstruction(this.remainingTime.toString());
        }
      } else {
        this.moveToNextSubPhaseOrRound();
      }
    }, 1000);

    // Initialisation de la première sous-phase
    const initialSubPhase = currentPhase.phases[this.currentSubPhaseIndex];
    this.remainingTime = initialSubPhase.duration;

    // Énoncer le nom de la phase au début
    this.instructionService.speakInstruction(
      `${currentPhase.id} - ${initialSubPhase.type === 'active' ? currentPhase.phases[0].description : 'Phase de repos'}`
    );
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
      const nextSubPhase = currentPhase.phases[this.currentSubPhaseIndex];
      this.remainingTime = nextSubPhase.duration;

      // Énoncer le nom de la prochaine sous-phase
      if (nextSubPhase.type === 'active') {
        this.instructionService.speakInstruction(
          `${currentPhase.id} - ${nextSubPhase.type === 'active' ? 'Phase active' : 'Phase de repos' }`
        );
      } else {
        this.instructionService.speakInstruction(
          ` Repos pendant ${this.remainingTime} secondes`
        );
      }
    } else if (this.currentRound < currentPhase.rounds) {
      // Passe au round suivant
      this.currentRound++;
      this.currentSubPhaseIndex = 0; // Recommence à la première sous-phase
      const firstSubPhase = currentPhase.phases[this.currentSubPhaseIndex];
      this.remainingTime = firstSubPhase.duration;

      // Énoncer le début du round suivant
      this.instructionService.speakInstruction(
        `Round ${this.currentRound} - ${firstSubPhase.type === 'active' ? currentPhase.phases[0].description : 'Phase de repos'}`
      );
      
      
    } else if (currentPhase.endRest) {
      // Gère le repos final après la phase
      this.remainingTime = currentPhase.endRest;

      this.instructionService.speakInstruction(
        `Repos final de ${currentPhase.endRest} secondes`
      );

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

      // Énoncer le début de la nouvelle phase
      this.instructionService.speakInstruction(
        `Nouvelle phase : ${nextPhase.id}`
      );
      this.instructionService.speakInstruction(
        `${nextPhase.phases[0].description}`
      );
    } else {
      // Fin de la séquence Tabata
      this.stopTabata();
      this.instructionService.speakInstruction('Séquence terminée !');
      alert('Séquence terminée !');
    }
  }
}

