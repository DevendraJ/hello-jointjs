import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DrawComponent } from "./draw/draw.component";

const routes: Routes = [
  {
    path: "",
    component: DrawComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
