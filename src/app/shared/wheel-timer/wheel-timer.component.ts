import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ClockComponent } from '../../../feature/components/clock/clock.component';
import { VoiceService } from '../voices/voice.service';
import { InstructionsService } from '../instructions/instructions.service';



@Component({
    selector: 'wheel-timer',
    templateUrl: './wheel-timer.component.html',
    styleUrls: ['./wheel-timer.component.css'],
    imports: [CommonModule, MatIconModule, ClockComponent]
})
export class WheelTimer {

    constructor(public voiceService: VoiceService, public instructionService: InstructionsService) { }

    hours = Array.from({ length: 24 }, (_, i) => i); // de 0 à 23
    minutes = Array.from({ length: 60 }, (_, i) => i); // de 0 à 59
    seconds = Array.from({ length: 60 }, (_, i) => i); // de 0 à 59

    selectedHour = 0;
    selectedMinute = 0;
    selectedSecond = 0;

    timerId: any;
    isTimerRunning = false;
    isPaused = false;
    remainingTimeInSeconds: number = 0;
    pausedTime: number = 0;
    displayTime: string = "00:00:00"; // Affichage du timer au format HH:MM:SS

    updateTime(event: WheelEvent, unit: 'hours' | 'minutes' | 'seconds') {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 1 : -1;

        if (unit === 'hours') {
            this.selectedHour = (this.selectedHour + delta + 24) % 24;
        } else if (unit === 'minutes') {
            this.selectedMinute = (this.selectedMinute + delta + 60) % 60;
        } else if (unit === 'seconds') {
            this.selectedSecond = (this.selectedSecond + delta + 60) % 60;
        }
    }

    selectTime(value: number, unit: 'hours' | 'minutes' | 'seconds') {
        if (unit === 'hours') {
            this.selectedHour = value;
        } else if (unit === 'minutes') {
            this.selectedMinute = value;
        } else if (unit === 'seconds') {
            this.selectedSecond = value;
        }
    }

    selectAuto(value: number) {
        this.selectedMinute = value;
        this.instructionService.speakInstruction(`Minuteur choisie: ${this.selectedMinute} minutes`);
    }

    startCustomTimer() {
        if (this.isPaused) {
            // Reprendre à partir de la pause
            this.isTimerRunning = true;
            this.remainingTimeInSeconds = this.pausedTime;
            this.isPaused = false;
            this.runTimer();
        } else {
            // Démarrer avec la nouvelle durée
            this.isTimerRunning = true;
            this.remainingTimeInSeconds = this.selectedHour * 3600 + this.selectedMinute * 60 + this.selectedSecond;
            this.displayTime = this.formatTime(this.remainingTimeInSeconds);
            this.runTimer();
            const instruction = this.formatTimerInstruction(this.selectedMinute, this.selectedSecond);
            this.instructionService.speakInstruction(`Minuteur lancé: ${instruction}`);
        }
    }

    runTimer() {
        this.timerId = setInterval(() => {
            if (this.remainingTimeInSeconds > 0) {
                this.remainingTimeInSeconds--;
                this.displayTime = this.formatTime(this.remainingTimeInSeconds);
                if (this.remainingTimeInSeconds <= 5 && this.remainingTimeInSeconds > 0) {
                    this.instructionService.speakInstruction(this.remainingTimeInSeconds.toString());
                }
                if (this.remainingTimeInSeconds === 0) {
                    const instruction = this.formatTimerInstruction(this.selectedMinute, this.selectedSecond);
                    this.instructionService.speakInstruction(`BipBipBip fin du minuteur de ${instruction}`);
                }
            }  else {
                clearInterval(this.timerId);
                this.isTimerRunning = false;
            }
        }, 1000);
    }

    formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
    }

    pad(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    stopTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.isTimerRunning = false;
            this.isPaused = false;
            this.pausedTime = 0;
            this.displayTime = "00:00:00";
        }
    }

    pauseTimer() {
        if (this.isTimerRunning) {
            clearInterval(this.timerId);
            this.isTimerRunning = false;
            this.isPaused = true;
            this.pausedTime = this.remainingTimeInSeconds;
        }
    }

    private formatTimerInstruction(minutes: number, seconds: number): string {
        if (minutes !== 0 && seconds !== 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} et ${seconds} seconde${seconds > 1 ? 's' : ''}`;
        } else if (minutes !== 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (seconds !== 0) {
            return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
        } else {
            return 'aucune durée';
        }
    }
}