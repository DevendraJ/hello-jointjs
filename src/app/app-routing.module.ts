import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FlowChartWrapperComponent } from "./components/flow-chart-wrapper/flow-chart-wrapper.component";

const routes: Routes = [
  {
    path: "",
    component: FlowChartWrapperComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
