import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'regular-timer',
  imports: [ MatTabsModule, MatButtonModule, CommonModule],
  templateUrl: './regular-timer.component.html',
  styleUrls: ['./regular-timer.component.css']
})
export class RegularTimerComponent {

  tabs = [
    { label: 'Tab 1', content: 'Contenu de l\'onglet 1' },
    { label: 'Tab 2', content: 'Contenu de l\'onglet 2' },
  ];
  
}
