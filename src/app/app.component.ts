import { Component } from '@angular/core';

import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    SplashScreen.hide().catch((err) => {
      console.warn(`Ummm... Something went wrong with the SplashScreen`);
      console.warn(err);
    });

    StatusBar.setBackgroundColor({ color: '#2dd36f' }).catch((err) => {
      console.warn(`Ummm... Something went wrong with the StatusBar`);
      console.warn(err);
    });
  }
}
