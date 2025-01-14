import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css'],
  imports: [ CommonModule ]
})
export class ClockComponent {
  @Input() rounds?: number = 0;
  @Input() currentRound?: number = 0;
  @Input() timeLeft?: number = 0;
  @Input() currentPhase?: string = '';
  @Input() displayRound?: boolean = true;

  // Méthode pour formater le temps en HH:mm:ss
  formatTime(seconds: number | undefined): string {
    // Si timeLeft est undefined, on le remplace par 0
    const validSeconds = seconds ?? 0; 

    const hours = Math.floor(validSeconds / 3600);
    const minutes = Math.floor((validSeconds % 3600) / 60);
    const remainingSeconds = validSeconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  // Méthode pour ajouter un zéro devant si nécessaire
  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
