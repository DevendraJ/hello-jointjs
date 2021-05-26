import { Injectable } from "@angular/core";
import * as joint from "jointjs/dist/joint";
import * as $ from "jquery";
import * as _ from "underscore";
import { shapesData } from "./shape-data";

@Injectable({
  providedIn: "root",
})
export class ShapeService {
  constructor() {}

  private createRectangle(paletteGraph, xAxis, yAxis) {
    new joint.shapes.standard.Rectangle()
      .resize(shapesData.shapes.default.width, shapesData.shapes.default.height)
      .attr(shapesData.shapes.default.attr)
      .position(xAxis, yAxis)
      .addTo(paletteGraph);
  }

  private createCircle(paletteGraph, xAxis, yAxis) {
    new joint.shapes.standard.Circle()
      .resize(shapesData.shapes.default.width, shapesData.shapes.default.height)
      .attr(shapesData.shapes.default.attr)
      .position(xAxis, yAxis)
      .addTo(paletteGraph);
  }

  private createHtmlRect(paletteGraph, xAxis, yAxis) {
    let htmlRect = new joint.shapes["html"].Rect({
      position: { x: xAxis, y: yAxis },
      size: { width: 60, height: 30 },
    });
    htmlRect.attr("label/text", "");
    htmlRect.addTo(paletteGraph);
  }

  private createPolygon(paletteGraph, xAxis, yAxis) {
    new joint.shapes.standard.Polygon()
      .resize(shapesData.shapes.default.width, shapesData.shapes.default.height)
      .attr(shapesData.shapes.default.attr)
      .attr("body/refPoints", "0,10 10,0 20,10 10,20")
      .position(xAxis, yAxis)
      .addTo(paletteGraph);
  }

  public customRectangle(paletteGraph, xAxis, yAxis) {
    var element = new joint.shapes["html"].Element({
      position: { x: xAxis, y: yAxis },
      size: { width: 170, height: 100 },
      label: "I am HTML",
      select: "one",
    });
    paletteGraph.addCells([element]);
  }

  public populatePalettePaper(paletteGraph, shapesList, axis) {
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
        case "htmlRect":
          this.createHtmlRect(paletteGraph, xAxis, yAxis);
          break;
        case "polygon":
          this.createPolygon(paletteGraph, xAxis, yAxis);
          break;
        case "customRect":
          this.customRectangle(paletteGraph, xAxis, yAxis);
          break;
      }
    });
  }

  public registerPalettePaperEvents(paper, graph, palettePaper) {
    let cloneAndResize = this.cloneAndResize;

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
      let flyShape = cloneAndResize(cellView.model);
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
          let newCell = flyShape.clone();
          newCell.position(x - target.left - offset.x, y - target.top - offset.y);
          graph.addCell(newCell);
        }

        $("body").off("mousemove.fly").off("mouseup.fly");
        flyShape.remove();
        $("#flyPaper").remove();
      });
    });
  }

  private cloneAndResize(element) {
    let newElement = element.clone();
    let type:String = newElement.get('type');
    if(type != 'standard.Circle') {
      newElement.resize(90, 50);
    } else {
      newElement.resize(50, 50);
    }
    return newElement;
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
