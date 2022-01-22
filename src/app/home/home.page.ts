import { Component, OnInit, ViewChild } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import {
  AlertController,
  IonContent,
  IonList,
  NavController,
} from '@ionic/angular';

import { Checklist } from '../interfaces/checklist';
import { ChecklistService } from '../services/checklist.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonList, { static: false }) slidingList: IonList;
  @ViewChild(IonContent, { static: false }) contentArea: IonContent;

  checklists: Checklist[] = [];

  constructor(
    private checklistService: ChecklistService,
    private alertController: AlertController,
    private navController: NavController,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.checklistService
      .getChecklists()
      .subscribe((checklists: Checklist[]) => {
        this.checklists = checklists;
      });
  }

  async addChecklist(): Promise<void> {
    const introPreviouslyShown = await this.storage.get('introShown');

    if (introPreviouslyShown === null) {
      this.storage.set('introShown', true);
      this.navController.navigateRoot('/intro');
    }

    const alert = await this.alertController.create({
      header: 'New Checklist',
      message: 'Enter the name of your new checklist below:',
      inputs: [{ type: 'text', name: 'name' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: async (data) => {
            await this.checklistService.createChecklist(data.name);
            this.contentArea.scrollToBottom(300);
          },
        },
      ],
    });

    alert.present();
  }

  async renameChecklist(checklist: Checklist): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Rename Checklist',
      message: 'Enter the new name of this checklist below:',
      inputs: [{ type: 'text', name: 'name' }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: async (data) => {
            await this.checklistService.updateChecklist(
              checklist.id,
              data.name
            );
            this.slidingList.closeSlidingItems();
          },
        },
      ],
    });

    alert.present();
  }

  async removeChecklist(checklist: Checklist): Promise<void> {
    await this.slidingList.closeSlidingItems();
    this.checklistService.removeChecklist(checklist.id);
  }
}
