import { Component } from '@angular/core';
import { ClockInstance } from '../../clock/clock-instance';
import { ClockComponent } from '../../clock/clock.component';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomTimerComponent } from '../../../../app/shared/custom-timer/custom-timer.component';


@Component({
  selector: 'regular-timer',
  templateUrl: './regular-timer.component.html',
  styleUrls: ['./regular-timer.component.css'],
  imports: [ClockComponent, CommonModule, MatSliderModule, MatButtonModule, 
    MatIconModule, MatExpansionModule, MatTabsModule, CustomTimerComponent]
})
export class RegularTimerComponent {
  // clockInstances: { [id: string]: ClockInstance } = {};  // Stocker les instances de ClockInstance
  // initialConfigurations: { [key: string]: { duration: number } } = {};

  // selectedClockId: string | null = null;
  // selectedClock: ClockComponent | null = null; // Pour suivre l'horloge sélectionnée

  // constructor() {
  //   // Créer des horloges avec des IDs uniques
  //   this.initializeTimers();
  // }

  // // Initialisation des timers statiques avec les durées spécifiques
  // initializeTimers(): void {
  //   // Exemple avec 3 timers : "clock1", "clock2", "clock3"
  //   this.clockInstances['clock1'] = new ClockInstance(60); // Durée de 60 secondes
  //   this.clockInstances['clock2'] = new ClockInstance(180); // Durée de 180 secondes
  //   this.clockInstances['clock3'] = new ClockInstance(420); // Durée de 420 secondes
  //   // Enregistrement de la configuration initiale de chaque timer
  //   this.initialConfigurations['clock1'] = { duration: 60 };
  //   this.initialConfigurations['clock2'] = { duration: 180 };
  //   this.initialConfigurations['clock3'] = { duration: 420 };
  // }

  // createClock(id: string, duration: number): void {
  //   const newClock = new ClockInstance(); // Exemple avec 3 rounds
  //   this.clockInstances[id] = newClock;

  //   // Sauvegarde de la configuration initiale
  //   this.initialConfigurations[id] = { duration: duration };
  // }

  // selectClock(id: string): void {
  //   this.selectedClockId = id;
  // }

  // play(): void {
  //   if (this.selectedClockId) {
  //     this.clockInstances[this.selectedClockId]?.startClock();
  //   }
  // }

  // pause(): void {
  //   if (this.selectedClockId) {
  //     this.clockInstances[this.selectedClockId]?.stopClock();
  //   }
  // }

  // stop(): void {
  //   if (!this.selectedClockId) {
  //     return;
  //   }

  //   const selectedTimer = this.clockInstances[this.selectedClockId];
  //   selectedTimer.stopClock(); // Arrête l'intervalle

  //   const initialConfig = this.initialConfigurations[this.selectedClockId];

  //   if (!initialConfig) {
  //     return;
  //   }

  //   // Réinitialise les valeurs à la configuration initiale
  //   selectedTimer.timeLeft = initialConfig.duration;
  //   selectedTimer.currentRound = 1;
  //   selectedTimer.currentPhase = 'Idle';
  // }

  // get objectKeys(): (obj: object) => string[] {
  //   return Object.keys;
  // }

}
