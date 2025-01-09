import { Component, ViewChild } from '@angular/core';
import { ClockService } from '../../clock/clock.service';
import { ClockInstance } from '../../clock/clock-instance';
import { ClockComponent } from '../../clock/clock.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'regular-timer',
  templateUrl: './regular-timer.component.html',
  styleUrls: ['./regular-timer.component.css'],
  imports: [ClockComponent, CommonModule]
})
export class RegularTimerComponent {
  clockInstances: { [id: string]: ClockInstance } = {};  // Stocker les instances de ClockInstance
  selectedClockId: string | null = null;  
  selectedClock: ClockComponent | null = null; // Pour suivre l'horloge sélectionnée

  constructor(private clockService: ClockService) {
    // Créer des horloges avec des IDs uniques
    this.clockInstances['clock1'] = this.clockService.createClockInstance(1); // 1 minute
    this.clockInstances['clock2'] = this.clockService.createClockInstance(3); // 3 minutes
    this.clockInstances['clock3'] = this.clockService.createClockInstance(7); // 7 minutes
  }
  createClock(id: string, rounds: number, duration: number): void {
    const clockInstance = this.clockService.createClockInstance(duration/*, rounds, duration*/);
    this.clockInstances[id] = clockInstance;
  }

  selectClock(id: string): void {
    this.selectedClockId = id;
    console.log(`Clock ${id} selected`);
  }

  play(): void {
    if (this.selectedClockId) {
      this.clockInstances[this.selectedClockId]?.startClock();
      console.log(`Play clock ${this.selectedClockId}`);
    }
  }

  pause(): void {
    if (this.selectedClockId) {
      this.clockInstances[this.selectedClockId]?.stopClock();
      console.log(`Pause clock ${this.selectedClockId}`);
    }
  }

  restart(): void {
    if (this.selectedClockId) {
      this.clockInstances[this.selectedClockId]?.resetClock();
      console.log(`Restart clock ${this.selectedClockId}`);
    }
  }

  get objectKeys(): (obj: object) => string[] {
    return Object.keys;
  }
  
}
