import { Injectable } from "@angular/core";
import * as joint from "jointjs/dist/joint";
import * as $ from "jquery";

@Injectable({
  providedIn: "root",
})
export class ShapeService {
  constructor() {}

  private createRectangle(paletteGraph, xAxis, yAxis) {
    let rectEntry = new joint.shapes.standard.Rectangle();
    rectEntry.position(xAxis, yAxis);
    rectEntry.resize(60, 30);
    rectEntry.attr({
      body: {
        fill: "white",
      },
    });
    rectEntry.addTo(paletteGraph);
  }

  private createCircle(paletteGraph, xAxis, yAxis) {
    let circleEntry = new joint.shapes.standard.Circle();
    circleEntry.position(xAxis, yAxis);
    circleEntry.resize(60, 30);
    circleEntry.attr("body/stroke", "rgb(0, 0, 0)");
    circleEntry.addTo(paletteGraph);
  }

  private createEllipse(paletteGraph, xAxis, yAxis) {
    let ellipseEntry = new joint.shapes.standard.Ellipse();
    ellipseEntry.position(xAxis, yAxis);
    ellipseEntry.resize(60, 30);
    ellipseEntry.attr("body/stroke", "rgb(0, 0, 0)");
    ellipseEntry.addTo(paletteGraph);
  }

  public createShapesPanel(paletteGraph, shapesList, axis) {
    var columns = shapesList.columns;
    shapesList.shapes.general.forEach((item, index) => {
      var xAxis = 0;
      var yAxis = axis.yAxis + Math.floor(index / columns) * 60;

      var count = index % columns;

      if (count) {
        xAxis = axis.xAxis + count * 60;
      } else {
        xAxis = axis.xAxis;
      }

      switch (item) {
        case "rectangle":
          this.createRectangle(paletteGraph, xAxis, yAxis);
          break;
        case "circle":
          this.createCircle(paletteGraph, xAxis, yAxis);
          break;
        case "ellipse":
          this.createEllipse(paletteGraph, xAxis, yAxis);
          break;
      }
    });
  }

  public registerPalettePaperEvents(paper, graph, palettePaper) {
    palettePaper.on("cell:pointerdown", function (cellView, e, x, y) {
      $("body").append(
        '<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>'
      );
      let flyGraph = new joint.dia.Graph();
      let flyPaper = new joint.dia.Paper({
        el: $("#flyPaper"),
        model: flyGraph,
        interactive: false,
      });
      let flyShape = cellView.model.clone();
      let pos = cellView.model.position();
      let offset = {
        x: x - pos.x,
        y: y - pos.y,
      };

      flyShape.position(0, 0);
      flyGraph.addCell(flyShape);
      $("#flyPaper").offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y,
      });
      $("body").on("mousemove.fly", function (e) {
        $("#flyPaper").offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y,
        });
      });
      $("body").on("mouseup.fly", function (e) {
        let x = e.pageX;
        let y = e.pageY;
        let target = paper.$el.offset();

        if (
          x > target.left &&
          x < target.left + paper.$el.width() &&
          y > target.top &&
          y < target.top + paper.$el.height()
        ) {
          let s = flyShape.clone();
          s.position(x - target.left - offset.x, y - target.top - offset.y);
          graph.addCell(s);
        }

        $("body").off("mousemove.fly").off("mouseup.fly");
        flyShape.remove();
        $("#flyPaper").remove();
      });
    });
  }

  public registerPaperListeners(paper) {
    paper.on({
      "link:pointermove": function (elementView, evt, x, y) {
        let coordinates = new joint.g.Point(x, y);
        let link = elementView.model as joint.shapes.standard.Link;
        let source = link.source();
        link.disconnect();
        link.source(source);

        let elementBelow = this.model
          .findModelsFromPoint(coordinates)
          .find(function (el) {
            return el.id !== link.id;
          });

        if (elementBelow) {
          link.target(elementBelow);
        } else {
          link.target(coordinates);
        }
      },

      "element:pointerclick": function (elementView: joint.dia.CellView) {
        this.removeTools();
        let elementToolsView = new joint.dia.ToolsView({
          tools: [
            new joint.elementTools.Boundary(),
            new joint.elementTools.Remove(),
            new joint.elementTools["LinkButton"](),
          ],
        });
        elementView.addTools(elementToolsView);
      },

      "link:pointerclick": function (linkView: joint.dia.LinkView) {
        let linkToolsView = new joint.dia.ToolsView({
          tools: [new joint.linkTools.Remove()],
        });
        linkView.addTools(linkToolsView);
      },

      "blank:pointerclick": function (elementView: joint.dia.CellView) {
        this.removeTools();
      },
    });
  }
}
