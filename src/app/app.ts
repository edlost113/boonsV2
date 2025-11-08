import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
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
  imports: [RouterOutlet, CommonModule, MatCardModule, MatToolbarModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatExpansionModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly title = signal('angular-boons');
  boons = signal<Boon[]>([]);
  searchTerm = signal<string>('');
  pinnedBoons = signal<number[]>(this.loadPinnedFromStorage());
  expandedPanels = signal<Set<number>>(this.loadExpandedFromStorage());
  
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

  // Computed signal for pinned boons with counts
  pinnedBoonsData = computed(() => {
    const pinnedIds = this.pinnedBoons();
    const boonCounts = new Map<number, number>();
    
    // Count occurrences of each pinned boon ID
    pinnedIds.forEach(id => {
      boonCounts.set(id, (boonCounts.get(id) || 0) + 1);
    });
    
    // Create array with boon data and count information
    const result: (Boon & { count: number })[] = [];
    boonCounts.forEach((count, id) => {
      const boon = this.boons().find(b => b.id === id);
      if (boon) {
        result.push({ ...boon, count });
      }
    });
    
    return result;
  });

  // Computed signal for total cost of pinned boons
  pinnedTotalCost = computed(() => {
    return this.pinnedBoonsData().reduce((total, boon) => total + (boon.lvl * boon.count), 0);
  });
  
  // Computed signal to group filtered boons by level and then by prerequisite
  groupedBoons = computed(() => {
    const boons = this.filteredBoons();
    const pinnedIds = new Set(this.pinnedBoons());
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
    const currentPinned = [...this.pinnedBoons()];
    currentPinned.push(boonId);
    this.pinnedBoons.set(currentPinned);
    this.savePinnedToStorage(currentPinned);
  }

  unpinBoon(boonId: number) {
    const currentPinned = [...this.pinnedBoons()];
    const index = currentPinned.indexOf(boonId);
    if (index > -1) {
      currentPinned.splice(index, 1);
      this.pinnedBoons.set(currentPinned);
      this.savePinnedToStorage(currentPinned);
    }
  }

  isPinned(boonId: number): boolean {
    return this.pinnedBoons().includes(boonId);
  }

  clearAllPins() {
    const emptyArray: number[] = [];
    this.pinnedBoons.set(emptyArray);
    this.savePinnedToStorage(emptyArray);
  }

  isPanelExpanded(level: number): boolean {
    return this.expandedPanels().has(level);
  }

  onPanelToggle(level: number, isExpanded: boolean) {
    const currentExpanded = new Set(this.expandedPanels());
    
    if (isExpanded) {
      currentExpanded.add(level);
    } else {
      currentExpanded.delete(level);
    }
    
    this.expandedPanels.set(currentExpanded);
    this.saveExpandedToStorage(currentExpanded);
  }

  private loadPinnedFromStorage(): number[] {
    try {
      const stored = localStorage.getItem('angular-boons-pinned');
      if (stored) {
        return JSON.parse(stored) as number[];
      }
    } catch (error) {
      console.error('Error loading pinned boons from localStorage:', error);
    }
    return [];
  }

  private savePinnedToStorage(pinnedArray: number[]) {
    try {
      localStorage.setItem('angular-boons-pinned', JSON.stringify(pinnedArray));
    } catch (error) {
      console.error('Error saving pinned boons to localStorage:', error);
    }
  }

  private loadExpandedFromStorage(): Set<number> {
    try {
      const stored = localStorage.getItem('angular-boons-expanded');
      if (stored) {
        const array = JSON.parse(stored) as number[];
        return new Set(array);
      }
    } catch (error) {
      console.error('Error loading expanded panels from localStorage:', error);
    }
    return new Set();
  }

  private saveExpandedToStorage(expandedSet: Set<number>) {
    try {
      localStorage.setItem('angular-boons-expanded', JSON.stringify(Array.from(expandedSet)));
    } catch (error) {
      console.error('Error saving expanded panels to localStorage:', error);
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
