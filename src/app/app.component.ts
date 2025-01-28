import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WheelTimer } from './shared/wheel-timer/wheel-timer.component';
import { BoxingTimerComponent } from '../feature/components/boxingTimer/boxing-timer.component';
import { TabataComponent } from "../feature/components/tabata/tabata.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, BoxingTimerComponent, WheelTimer, TabataComponent],

})
export class AppComponent {
  // Fonction pour défiler à gauche
  scrollLeft() {
    const container = document.querySelector('.content-container') as HTMLElement;
    container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
  }

  // Fonction pour défiler à droite
  scrollRight() {
    const container = document.querySelector('.content-container') as HTMLElement;
    container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
  }
}
