import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FlowChartWrapperComponent } from "./components/flow-chart-wrapper/flow-chart-wrapper.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "hello-jointjs";

  @ViewChild(RouterOutlet, { static: false })
  private routerOutlet: RouterOutlet;

  extractGraphJSON() {
    if (this.routerOutlet && this.routerOutlet.component) {
      if (this.routerOutlet.component instanceof FlowChartWrapperComponent) {
        (this.routerOutlet.component as FlowChartWrapperComponent).extractGraphJSON();
      }
    }
  }
}
