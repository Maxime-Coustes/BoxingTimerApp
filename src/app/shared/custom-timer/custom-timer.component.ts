import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'custom-timer',
    templateUrl: './custom-timer.component.html',
    styleUrls: ['./custom-timer.component.css'],
    imports: [CommonModule]
})
export class CustomTimerComponent {

    // Options disponibles
    hours = Array.from({ length: 24 }, (_, i) => i); // de 0 à 23
    minutes = Array.from({ length: 60 }, (_, i) => i); // de 0 à 59
    seconds = Array.from({ length: 60 }, (_, i) => i); // de 0 à 59

    // Valeurs sélectionnées
    selectedHour = 0;
    selectedMinute = 0;
    selectedSecond = 0;

    // Variables pour gérer le timer
    timerId: any;
    isTimerRunning = false;
    remainingTimeInSeconds: number = 0;
    displayTime: string = "00:00:00"; // Affichage du timer au format HH:MM:SS

    // Sélectionne une valeur manuellement via un clic
    selectTime(value: number, unit: 'hours' | 'minutes' | 'seconds') {
        if (unit === 'hours') {
            this.selectedHour = value;
        } else if (unit === 'minutes') {
            this.selectedMinute = value;
        } else if (unit === 'seconds') {
            this.selectedSecond = value;
        }
    }

    // Méthode appelée lors du scroll pour ajuster les valeurs
    updateTime(event: WheelEvent, unit: 'hours' | 'minutes' | 'seconds') {
        // Empêche le défilement de la page
        event.preventDefault();

        const delta = event.deltaY > 0 ? 1 : -1; // Détermine si on défile vers le bas ou vers le haut

        if (unit === 'hours') {
            this.selectedHour = (this.selectedHour + delta + 24) % 24;
        } else if (unit === 'minutes') {
            this.selectedMinute = (this.selectedMinute + delta + 60) % 60;
        } else if (unit === 'seconds') {
            this.selectedSecond = (this.selectedSecond + delta + 60) % 60;
        }
    }

    // Démarre le timer avec la durée sélectionnée
    startCustomTimer() {
        this.isTimerRunning = true;
        this.remainingTimeInSeconds = this.selectedHour * 3600 + this.selectedMinute * 60 + this.selectedSecond;
        this.displayTime = this.formatTime(this.remainingTimeInSeconds);

        // Démarre l'intervalle pour mettre à jour chaque seconde
        this.timerId = setInterval(() => {
            if (this.remainingTimeInSeconds > 0) {
                this.remainingTimeInSeconds--;
                this.displayTime = this.formatTime(this.remainingTimeInSeconds);
            } else {
                clearInterval(this.timerId); // Arrête le timer lorsque le temps est écoulé
                this.isTimerRunning = false;
            }
        }, 1000);
    }

    // Formate le temps en HH:MM:SS
    formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
    }

    // Ajoute un zéro devant les valeurs inférieures à 10
    pad(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    stopCustomTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.isTimerRunning = false;
        }
    }
}
