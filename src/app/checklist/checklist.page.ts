import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertController, IonList } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { Checklist } from '../interfaces/checklist';
import { ChecklistItem } from '../interfaces/checklist-item';
import { ChecklistService } from '../services/checklist.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit, OnDestroy {
  @ViewChild(IonList, { static: false }) slidingList: IonList;
  checklist: Checklist = { id: '', title: '', items: [] };
  private checklistSubscription: Subscription;

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private checklistService: ChecklistService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.checklistSubscription = this.checklistService
      .getChecklist(id)
      .subscribe((checklist) => {
        this.checklist = checklist;
      });
  }

  ngOnDestroy() {
    if (this.checklistSubscription !== null) {
      this.checklistSubscription.unsubscribe();
    }
  }

  async addItem(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Add Item',
      message: 'Enter the name of the task for this checklist below:',
      inputs: [{ type: 'text', name: 'name' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: (data) => {
            this.checklistService.addItemToChecklist(
              this.checklist.id,
              data.name
            );
          },
        },
      ],
    });
    alert.present();
  }

  async renameItem(item: ChecklistItem): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Rename Item',
      message: 'Enter the new name of the task for this checklist below:',
      inputs: [{ type: 'text', name: 'name' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: (data) => {
            this.checklistService.updateItemInChecklist(
              this.checklist.id,
              item.id,
              data.name
            );
          },
        },
      ],
    });
    alert.present();
  }

  async removeItem(item: ChecklistItem): Promise<void> {
    await this.slidingList.closeSlidingItems();
    this.checklistService.removeItemFromChecklist(this.checklist.id, item.id);
  }

  toggleItem(item: ChecklistItem): void {
    this.checklistService.setItemStatus(
      this.checklist.id,
      item.id,
      !item.checked
    );
  }

  restartList(): void {
    this.checklistService.resetItemStatusForChecklist(this.checklist.id);
  }
}
