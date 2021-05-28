import { Component, Input, OnInit } from "@angular/core";
import { ShapeService } from "src/app/services/shape.service";

@Component({
  selector: "app-palette",
  templateUrl: "./palette.component.html",
  styleUrls: ["./palette.component.css"],
})
export class PaletteComponent implements OnInit {
  @Input() graph;
  constructor(private shapeService: ShapeService) {}

  public create() {
    var element = document.getElementById("rectangle");
    if (element) {
      this.shapeService.populatePalettePaper(this.graph, ["rectangle"], {
        xAxis: 300,
        yAxis: 300,
      });
    }
  }

  ngOnInit() {}
}
