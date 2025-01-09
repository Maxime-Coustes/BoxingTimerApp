import { Component, Input } from '@angular/core';
import { ClockInstance } from './clock-instance';  // Assure-toi que le chemin est correct
import { CommonModule } from '@angular/common';
@Component({
  selector: 'clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css'],
  imports: [ CommonModule ]
})
export class ClockComponent {
  @Input() clockInstance?: ClockInstance;  // Marquer comme optionnelle
  @Input() rounds?: number = 0;
  @Input() currentRound?: number = 0;
  @Input() timeLeft?: number = 0;
  @Input() currentPhase?: string = '';
  @Input() displayRound?: boolean = true;

  constructor() {
    // Ne pas initialiser ici, car l'instance est fournie par le parent.
  }

  // Méthodes d'interaction avec l'horloge en utilisant l'instance ClockInstance

  play() {
    this.clockInstance?.startClock();  // Utilisation de l'optional chaining
  }

  pause() {
    this.clockInstance?.stopClock();  // Utilisation de l'optional chaining
  }

  restart() {
    this.clockInstance?.resetClock();  // Utilisation de l'optional chaining
  }

  resume() {
    this.clockInstance?.startClock();  // Utilisation de l'optional chaining
  }

}
