import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DrawComponent } from './draw/draw.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hello-jointjs';

  @ViewChild(RouterOutlet, { static: false })
  private routerOutlet: RouterOutlet;

  extractGraphJSON() {
    if (this.routerOutlet && this.routerOutlet.component) {
      if (this.routerOutlet.component instanceof DrawComponent) {
        (this.routerOutlet.component as DrawComponent).extractGraphJSON();
      }
    }
  }
}
