import { Component, AfterViewInit, Renderer2 } from "@angular/core";
import * as joint from "jointjs/dist/joint";
import * as _ from "underscore";
import * as $ from "jquery";
import { ShapeService } from "../services/shape.service";
import { JointJsService } from "../services/joint-js.service";
import { CustomElementService } from "../services/custom-element.service";

@Component({
  selector: "app-draw",
  templateUrl: "./draw.component.html",
  styleUrls: ["./draw.component.css"],
})
export class DrawComponent implements AfterViewInit {
  public showProps: Boolean = false;
  public selectedElement: joint.dia.Element = null;
  private graph: joint.dia.Graph;
  private paper: joint.dia.Paper;

  private xAxis: number = 15;
  private yAxis: number = 15;

  private paletteGraph: joint.dia.Graph;
  private palettePaper: joint.dia.Paper;

  private paletteItems = {
    columns: 1,
    shapes: {
      general: ["rectangle", "circle", "polygon", "custom"],
      // general: ["customRect"],
    },
  };

  constructor(
    private renderer: Renderer2,
    private shapeService: ShapeService,
    private jointJsService: JointJsService,
    private customElementService: CustomElementService
  ) {}

  private registerDOMListeners() {
    this.renderer.listen(
      document.getElementById("canvas"),
      "contextmenu",
      (event) => {
        let { top, left } = $("#canvas").offset();
        let position = new joint.g.Point(event.clientX, event.clientY - 75);
        let elements: joint.dia.Element[] =
          this.graph.findModelsFromPoint(position);

        let size = elements.length;
        if (size > 0) {
          this.selectedElement = elements[size - 1];
          this.showProps = true;
        }
      }
    );

    this.renderer.listen(
      document.getElementById("canvas"),
      "click",
      (event) => {
        this.showProps = false;
      }
    );
  }

  private createPaper(graph) {
    return new joint.dia.Paper({
      el: document.getElementById("canvas"),
      model: graph,
      width: "100%",
      height: "80vh",
      cellViewNamespace: joint.shapes,
      gridSize: 10,
      background: {
        color: "whitesmoke",
      },
      drawGrid: {
        name: "dot",
      },
    });
  }

  private createGraph() {
    return new joint.dia.Graph(
      {},
      {
        cellNamespace: joint.shapes,
      }
    );
  }

  private createPaletteGraph() {
    return new joint.dia.Graph(
      {},
      {
        cellNamespace: joint.shapes,
      }
    );
  }

  private createPalettePaper(paletteGraph) {
    return new joint.dia.Paper({
      el: "#palette",
      model: paletteGraph,
      width: this.xAxis + this.paletteItems.columns * 80,
      height: (window.innerHeight * 3) / 4,
      cellViewNamespace: joint.shapes,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: "whitesmoke",
      },
      interactive: false,
    });
  }

  initializeCanvas() {
    this.registerDOMListeners();
    this.jointJsService.customizeJoint();

    this.graph = this.createGraph();
    this.paper = this.createPaper(this.graph);
    this.shapeService.registerPaperListeners(this.paper);
    this.paletteGraph = this.createPaletteGraph();
    this.palettePaper = this.createPalettePaper(this.paletteGraph);

    this.shapeService.populatePalettePaper(this.paletteGraph, this.paletteItems, {
      xAxis: this.xAxis,
      yAxis: this.yAxis,
    });

    this.shapeService.registerPalettePaperEvents(
      this.paper,
      this.graph,
      this.palettePaper
    );
    this.shapeService.customRectangle(this.graph, 180, 180);
  }

  ngAfterViewInit() {
    this.initializeCanvas();
  }

  extractGraphJSON() {
    console.log(JSON.stringify(this.graph.toJSON()));
  }
}
