export class ClockInstance {
  rounds: number = 1;
  currentRound: number = 0;
  timeLeft: number = 60;
  currentPhase: string = 'Ready';
  private timer: any;

  constructor(duration: number = 60) {
    this.timeLeft = duration;  // Durée par défaut si aucun argument passé
    this.currentRound = 1;
    this.currentPhase = 'Idle';
  }

  setRoundDuration(duration: number): void {
    this.timeLeft = duration * 60; // minutes en secondes
  }

  startClock(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.nextRound();
      }
    }, 1000);
  }

  stopClock(): void {
    clearInterval(this.timer);
  }

  resetClock(): void {
    this.stopClock();
    this.currentRound = 0;
    this.timeLeft = 60;
    this.currentPhase = 'Ready';
  }

  private nextRound(): void {
    if (this.currentRound < this.rounds) {
      this.currentRound++;
      this.timeLeft = 60;
    } else {
      this.stopClock();
    }
  }
}
