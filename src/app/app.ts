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
  pinnedBoons = signal<Set<number>>(this.loadPinnedFromStorage());
  
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

  // Computed signal for pinned boons
  pinnedBoonsData = computed(() => {
    const pinnedIds = this.pinnedBoons();
    return this.boons().filter(boon => pinnedIds.has(boon.id));
  });

  // Computed signal for total cost of pinned boons
  pinnedTotalCost = computed(() => {
    return this.pinnedBoonsData().reduce((total, boon) => total + boon.lvl, 0);
  });
  
  // Computed signal to group filtered boons by level and then by prerequisite
  groupedBoons = computed(() => {
    const boons = this.filteredBoons();
    const pinnedIds = this.pinnedBoons();
    // Filter out pinned boons from the main grid
    const unpinnedBoons = boons.filter(boon => !pinnedIds.has(boon.id));
    const grouped: { [level: number]: { [prerequisite: string]: Boon[] } } = {};
    
    unpinnedBoons.forEach(boon => {
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

  togglePin(boonId: number) {
    const currentPinned = new Set(this.pinnedBoons());
    if (currentPinned.has(boonId)) {
      currentPinned.delete(boonId);
    } else {
      currentPinned.add(boonId);
    }
    this.pinnedBoons.set(currentPinned);
    this.savePinnedToStorage(currentPinned);
  }

  isPinned(boonId: number): boolean {
    return this.pinnedBoons().has(boonId);
  }

  clearAllPins() {
    const emptySet = new Set<number>();
    this.pinnedBoons.set(emptySet);
    this.savePinnedToStorage(emptySet);
  }

  private loadPinnedFromStorage(): Set<number> {
    try {
      const stored = localStorage.getItem('angular-boons-pinned');
      if (stored) {
        const pinnedArray = JSON.parse(stored) as number[];
        return new Set(pinnedArray);
      }
    } catch (error) {
      console.error('Error loading pinned boons from localStorage:', error);
    }
    return new Set<number>();
  }

  private savePinnedToStorage(pinnedSet: Set<number>) {
    try {
      const pinnedArray = Array.from(pinnedSet);
      localStorage.setItem('angular-boons-pinned', JSON.stringify(pinnedArray));
    } catch (error) {
      console.error('Error saving pinned boons to localStorage:', error);
    }
  }

  private loadBoons() {
    this.http.get<Boon[]>('assets/boons.json').subscribe({
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
