import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RegularTimerComponent } from '../feature/components/regular-timer/regular-timer/regular-timer.component';
import { BoxingTimerComponent } from '../feature/components/boxingTimer/boxing-timer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, BoxingTimerComponent, RegularTimerComponent],

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
