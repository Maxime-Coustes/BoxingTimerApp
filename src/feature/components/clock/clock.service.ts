import { Injectable } from '@angular/core';
import { ClockComponent } from './clock.component';
import { ClockInstance } from './clock-instance';  // Assure-toi que le chemin est correct

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private clockInstances: { [id: string]: ClockInstance } = {};

  constructor() {}

  createClockInstance(duration: number): ClockInstance {
    const clock = new ClockInstance();
    clock.setRoundDuration(duration);
    return clock;
  }

  // Créer une nouvelle horloge avec une durée donnée
  // createClockInstance(id: string, rounds: number, duration: number): ClockInstance {
  //   const clockInstance = new ClockInstance();
  //   clockInstance.setRounds(rounds);
  //   clockInstance.setRoundDuration(duration);
  //   this.clockInstances[id] = clockInstance;
  //   return clockInstance;
  // }

  getClockInstance(id: string): ClockInstance | undefined {
    return this.clockInstances[id];
  }

  removeClockInstance(id: string): void {
    delete this.clockInstances[id];
  }
}
