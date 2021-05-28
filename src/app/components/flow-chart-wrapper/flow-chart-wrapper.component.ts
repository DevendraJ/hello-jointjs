import {
  Component,
  AfterViewInit,
  Renderer2,
  ChangeDetectorRef,
} from "@angular/core";
import * as joint from "jointjs/dist/joint";
import * as _ from "underscore";
import * as $ from "jquery";
import { ShapeService } from "src/app/services/shape.service";
import { JointJsService } from "src/app/services/joint-js.service";

@Component({
  selector: "app-flow-chart-wrapper",
  templateUrl: "./flow-chart-wrapper.component.html",
  styleUrls: ["./flow-chart-wrapper.component.css"],
})
export class FlowChartWrapperComponent implements AfterViewInit {
  public showProps: Boolean = false;
  public selectedElement: joint.dia.Element = null;
  private graph: joint.dia.Graph;
  private paper: joint.dia.Paper;

  private xAxis: number = 15;
  private yAxis: number = 15;

  private paletteItems = {
    columns: 1,
    shapes: {
      general: ["rectangle", "circle", "polygon", "customRect"],
    },
  };

  constructor(
    private renderer: Renderer2,
    private shapeService: ShapeService,
    private jointJsService: JointJsService,
    private cdr: ChangeDetectorRef
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
        // color: "whitesmoke",
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

  initializeCanvas() {
    this.registerDOMListeners();
    this.jointJsService.customizeJoint();

    this.graph = this.createGraph();
    this.paper = this.createPaper(this.graph);
    this.shapeService.registerPaperListeners(this.paper);
  }

  public create() {
    var element = document.getElementById("rectangle");
    if (element) {
      this.shapeService.populatePalettePaper(this.graph, this.paletteItems, {
        xAxis: 300,
        yAxis: 300,
      });
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeCanvas();
    this.cdr.detectChanges();
  }

  extractGraphJSON() {
    console.log(JSON.stringify(this.graph.toJSON()));
  }
}
