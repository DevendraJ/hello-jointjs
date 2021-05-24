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

  private createElementByTemplate(attrs) {
    joint.shapes["html"] = {};
    joint.shapes["html"].Element = joint.shapes.basic.Rect.extend({
      defaults: joint.util.defaultsDeep(
        {
          type: "html.Element",
          attrs: {
            rect: { stroke: "none", "fill-opacity": 0 },
          },
        },
        joint.shapes.basic.Rect.prototype.defaults
      ),
    });

    joint.shapes["html"].ElementView = joint.dia.ElementView.extend({
      template: [
        '<div class="html-element" style="position: absolute;background: #3498DB;pointer-events: none;-webkit-user-select: none;border-radius: 4px;border: 2px solid #2980B9;box-shadow: inset 0 0 5px black, 2px 2px 1px gray;padding: 5px;box-sizing: border-box;z-index: 2;">',
        '<button class="delete" style="pointer-events: auto;color: white;border: none;background-color: #C0392B;border-radius: 20px;width: 15px;height: 15px;line-height: 15px;text-align: middle;position: absolute;top: -15px;left: -15px;padding: 0;margin: 0;font-weight: bold;cursor: pointer;">x</button>',
        '<label style="color: #333;text-shadow: 1px 0 0 lightgray;font-weight: bold;"></label>',
        '<span style="position: absolute;top: 2px;right: 9px;color: white;font-size: 10px;"></span>',
        "<br>",
        '<select style="pointer-events: auto;position: absolute;right: 2px;bottom: 28px;"><option>--</option><option>one</option><option>two</option></select>',
        '<input type="text" value="I\'m HTML input" style="pointer-events: auto;position: absolute;bottom: 0;left: 0;right: 0;border: none;color: #333;padding: 5px;height: 16px;">',
        "</div>",
      ].join(""),

      initialize: function () {
        _.bindAll(this, "updateBox");
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        // Prevent paper from handling pointerdown.
        this.$box.find("input,select").on("mousedown click", function (evt) {
          evt.stopPropagation();
        });
        // This is an example of reacting on the input change and storing the input data in the cell model.
        this.$box.find("input").on(
          "change",
          _.bind(function (evt) {
            this.model.set("input", $(evt.target).val());
          }, this)
        );
        this.$box.find("select").on(
          "change",
          _.bind(function (evt) {
            this.model.set("select", $(evt.target).val());
          }, this)
        );
        this.$box.find("select").val(this.model.get("select"));
        this.$box
          .find(".delete")
          .on("click", _.bind(this.model.remove, this.model));
        // Update the box position whenever the underlying model changes.
        this.model.on("change", this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on("remove", this.removeBox, this);

        this.updateBox();
      },
      render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
      },
      updateBox: function () {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.
        this.$box.find("label").text(this.model.get("label"));
        this.$box.find("span").text(this.model.get("select"));
        this.$box.css({
          width: bbox.width,
          height: bbox.height,
          left: bbox.x,
          top: bbox.y,
          transform: "rotate(" + (this.model.get("angle") || 0) + "deg)",
        });
      },
      removeBox: function (evt) {
        this.$box.remove();
      },
    });

    return new joint.shapes["html"].Element(attrs);
  }

  public customRectangle(paletteGraph, xAxis, yAxis) {
    var element = this.createElementByTemplate({
      position: { x: xAxis, y: yAxis },
      size: { width: 170, height: 100 },
      label: "I am HTML",
      select: "one",
    });
    paletteGraph.addCells([element]);
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
