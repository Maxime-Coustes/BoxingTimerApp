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

    private readonly SECONDS_IN_HOUR = 3600;
    private readonly SECONDS_IN_MINUTE = 60;

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

    /**
     * Met à jour la valeur d'une unité de temps (heure, minute ou seconde). 
     * @param event L'événement WheelEvent contenant les informations de défilement.
     * @param unit L'unité de temps à mettre à jour ('hours', 'minutes', 'seconds').
    */
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

    /**
     * Définit manuellement une valeur pour une unité de temps.
     * @param value La nouvelle valeur à affecter.
     * @param unit L'unité de temps concernée ('hours', 'minutes', 'seconds').
    */
    selectTime(value: number, unit: 'hours' | 'minutes' | 'seconds') {
        if (unit === 'hours') {
            this.selectedHour = value;
        } else if (unit === 'minutes') {
            this.selectedMinute = value;
        } else if (unit === 'seconds') {
            this.selectedSecond = value;
        }
    }

    /**
     * Définit une valeur de minute prédéfinie et émet une instruction vocale.
     * @param value La valeur de minute à définir.
    */
    selectAuto(value: number) {
        this.selectedMinute = value;
        this.instructionService.speakInstruction(`Minuteur choisie: ${this.selectedMinute} minutes`);
    }

    /**
     * Lance un minuteur personnalisé ou reprend un minuteur en pause.
    */
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
            const instruction = this.formatTimerInstruction(this.selectedHour, this.selectedMinute, this.selectedSecond);
            this.instructionService.speakInstruction(`Minuteur lancé: ${instruction}`);
        }
    }

    /**
     * Gère le décompte du minuteur et met à jour l'affichage en temps réel.
    */
    runTimer() {
        this.timerId = setInterval(() => {
            if (this.remainingTimeInSeconds > 0) {
                this.remainingTimeInSeconds--;
                this.displayTime = this.formatTime(this.remainingTimeInSeconds);
                if (this.remainingTimeInSeconds <= 5 && this.remainingTimeInSeconds > 0) {
                    this.instructionService.speakInstruction(this.remainingTimeInSeconds.toString());
                }
                if (this.remainingTimeInSeconds === 0) {
                    this.handleTimerEnd();
                }
            } else {
                clearInterval(this.timerId);
                this.isTimerRunning = false;
            }
        }, 1000);
    }

    /**
     * Formate un nombre de secondes en une chaîne de caractères au format HH:MM:SS.
     * @param seconds Le nombre de secondes à formater.
     * @returns Une chaîne représentant le temps au format HH:MM:SS.
    */
    formatTime(seconds: number): string {
        const hours = Math.floor(seconds / this.SECONDS_IN_HOUR);
        const minutes = Math.floor((seconds % this.SECONDS_IN_HOUR) / this.SECONDS_IN_MINUTE);
        const remainingSeconds = seconds % this.SECONDS_IN_MINUTE;
        return [hours, minutes, remainingSeconds].map(this.pad).join(':');
    }

    /**
     * Ajoute un zéro devant les nombres inférieurs à 10 pour les formater.
     * @param value La valeur à formater.
     * @returns Une chaîne de caractères avec un zéro si nécessaire.
    */
    pad(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    /**
     * Arrête complètement le minuteur et réinitialise ses valeurs.
    */
    stopTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.isTimerRunning = false;
            this.isPaused = false;
            this.pausedTime = 0;
            this.displayTime = "00:00:00";
        }
    }

    /**
     * Met en pause le minuteur sans réinitialiser les valeurs.
    */
    pauseTimer() {
        if (this.isTimerRunning) {
            clearInterval(this.timerId);
            this.isTimerRunning = false;
            this.isPaused = true;
            this.pausedTime = this.remainingTimeInSeconds;
        }
    }

    /**
     * Formate une instruction textuelle pour le minuteur en fonction des minutes et secondes restantes.
     * @param minutes Le nombre de minutes.
     * @param seconds Le nombre de secondes.
     * @returns Une chaîne descriptive de la durée.
    */
    private formatTimerInstruction(hours: number, minutes: number, seconds: number): string {
        if (hours !== 0 && minutes !== 0 && seconds !== 0) {
            return `${hours} heure${minutes > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''} et ${seconds} seconde${seconds > 1 ? 's' : ''}`;
        } else if (minutes !== 0 && seconds !== 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} et ${seconds} seconde${seconds > 1 ? 's' : ''}`;
        } else if (hours !== 0) {
            return `${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes !== 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (seconds !== 0) {
            return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
        } else {
            return 'aucune durée';
        }
    }

    /**
     * Gère la fin du minuteur en émettant une alerte vocale.
    */
    private handleTimerEnd(): void {
        const instruction = this.formatTimerInstruction(this.selectedHour, this.selectedMinute, this.selectedSecond);
        this.instructionService.speakInstruction(`BipBipBip fin du minuteur de ${instruction}`);
        clearInterval(this.timerId);
        this.isTimerRunning = false;
    }

}