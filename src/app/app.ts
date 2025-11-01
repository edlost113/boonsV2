import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type Boon = {
  id: number;
  name: string;
  desc: string;
  title: string;
  pre: string;
  lvl: number;
};


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatCardModule, MatToolbarModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly title = signal('angular-boons');
  boons = signal<Boon[]>([]);
  searchTerm = signal<string>('');
  
  // Computed signal to filter boons based on search term
  filteredBoons = computed(() => {
    const boons = this.boons();
    const search = this.searchTerm().toLowerCase().trim();
    
    if (!search) {
      return boons;
    }
    
    return boons.filter(boon => 
      boon.name.toLowerCase().includes(search) ||
      boon.desc.toLowerCase().includes(search) ||
      boon.pre.toLowerCase().includes(search)
    );
  });
  
  // Computed signal to group filtered boons by level and then by prerequisite
  groupedBoons = computed(() => {
    const boons = this.filteredBoons();
    const grouped: { [level: number]: { [prerequisite: string]: Boon[] } } = {};
    
    boons.forEach(boon => {
      if (!grouped[boon.lvl]) {
        grouped[boon.lvl] = {};
      }
      
      const prerequisite = boon.pre || 'No prerequisite';
      if (!grouped[boon.lvl][prerequisite]) {
        grouped[boon.lvl][prerequisite] = [];
      }
      
      grouped[boon.lvl][prerequisite].push(boon);
    });
    
    // Convert to array and sort by level, then by prerequisite
    return Object.keys(grouped)
      .map(level => ({
        level: parseInt(level),
        prerequisiteGroups: Object.keys(grouped[parseInt(level)])
          .map(prerequisite => ({
            prerequisite,
            boons: grouped[parseInt(level)][prerequisite]
          }))
          .sort((a, b) => {
            // Sort "No prerequisite" first, then alphabetically
            if (a.prerequisite === 'No prerequisite') return -1;
            if (b.prerequisite === 'No prerequisite') return 1;
            return a.prerequisite.localeCompare(b.prerequisite);
          })
      }))
      .sort((a, b) => a.level - b.level);
  });

  constructor() {
  }

  ngOnInit() {
    this.loadBoons();
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  private loadBoons() {
    this.http.get<Boon[]>('/assets/boons.json').subscribe({
      next: (boonsData) => {
        this.boons.set(boonsData);
        console.log('Loaded boons:', boonsData.length);
      },
      error: (error) => {
        console.error('Error loading boons:', error);
      }
    });
  }
}
