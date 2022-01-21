import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private checkLists$: BehaviorSubject<Checklist[]> = new BehaviorSubject<
    Checklist[]
  >([]);
  private checklists: Checklist[] = [];
  private loaded = false;

  constructor(private storage: Storage) {}

  async load(): Promise<void> {
    return Promise.resolve();
  }

  getChecklists(): Observable<Checklist[]> {
    return this.checkLists$;
  }

  getChecklist(checklistId: string): Observable<Checklist> {
    return this.checkLists$.pipe(
      map((checklists) =>
        checklists.find((checklist) => checklist.id === checklistId)
      )
    );
  }

  async createChecklist(title: string): Promise<void> {
    await this.load();

    const newChecklist: Checklist = {
      id: this.generateSlug(title),
      title,
      items: [],
    };

    this.checklists = [...this.checklists, newChecklist];
    await this.save();
  }

  async updateChecklist(checklistId: string, newTitle: string): Promise<void> {
    this.checklists = this.checklists.map((checklist) =>
      checklist.id === checklistId
        ? { ...checklist, title: newTitle }
        : checklist
    );
    await this.save();
  }

  async removeChecklist(checklistId: string): Promise<void> {
    this.checklists = this.checklists.filter(
      (checklist) => checklist.id !== checklistId
    );
    await this.save();
  }

  async addItemToChecklist(checklistId: string, title: string): Promise<void> {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      title,
      checked: false,
    };

    this.checklists = this.checklists.map((checklist) =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: [...checklist.items, newItem],
          }
        : checklist
    );

    this.save();
  }

  removeItemFromChecklist(checklistId: string, itemId: string): void {
    this.checklists = this.checklists.map((checklist) =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: [...checklist.items.filter((item) => item.id === itemId)],
          }
        : checklist
    );

    this.save();
  }

  updateItemInChecklist(
    checklistId: string,
    itemId: string,
    newTitle: string
  ): void {
    this.checklists = this.checklists.map((checklist) =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: [
              ...checklist.items.map((item) =>
                item.id === itemId ? { ...item, title: newTitle } : item
              ),
            ],
          }
        : checklist
    );

    this.save();
  }

  setItemStatus(checklistId: string, itemId: string, checked: boolean): void {
    this.checklists = this.checklists.map((checklist) =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: [
              ...checklist.items.map((item) =>
                item.id === itemId ? { ...item, checked } : item
              ),
            ],
          }
        : checklist
    );

    this.save();
  }

  resetItemStatusForChecklist(checklistId: string): void {
    this.checklists = this.checklists.map((checklist) =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: [
              ...checklist.items.map((item) => ({ ...item, checked: false })),
            ],
          }
        : checklist
    );

    this.save();
  }

  save(): Promise<void> {
    this.checkLists$.next(this.checklists);
    return Promise.resolve();
  }

  generateSlug(title: string): string {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    const matchingSlugs = this.checklists.filter(
      (checklist) => checklist.id.substring(0, slug.length) === slug
    );

    if (matchingSlugs.length > 0) {
      slug = `${slug}${Date.now().toString()}`;
    }

    return slug;
  }
}
