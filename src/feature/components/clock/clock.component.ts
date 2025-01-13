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

  

}
