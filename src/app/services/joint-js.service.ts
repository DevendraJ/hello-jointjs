import { Injectable } from "@angular/core";
import * as joint from "jointjs/dist/joint";
import * as $ from "jquery";
import * as _ from "underscore";

@Injectable({
  providedIn: "root",
})
export class JointJsService {
  constructor() {}

  private emailTemplate() {
    return [
      '<div class="emailer" style="border: 1px solid;width: 300px;background-color: #ddd;">',
      '<input name="from" placeholder="From" value="" style="padding: 10px;margin: 2px;width: 90%;">',
      '<input name="to" placeholder="To" value="" style="padding: 10px;margin: 2px;width: 90%;">',
      '<input name="cc" placeholder="CC" value="" style="padding: 10px;margin: 2px;width: 90%;">',
      '<textarea name="description" placeholder="Description" rows="3" style="padding: 10px;margin: 2px;width: 90%;"></textarea>',
      "</div>",
    ].join("");
  }

  private elementTemplate() {
    return [
      '<div class="html-element" style="position: none; background-color: #3498DB;pointer-events: none;-webkit-user-select: none;border-radius: 4px;border: 2px solid #2980B9;box-shadow: inset 0 0 5px black, 2px 2px 1px gray;padding: 5px;box-sizing: border-box;z-index: 2; transform: scale(1); ">',
      '<label style="color: #333;text-shadow: 1px 0 0 lightgray;font-weight: bold;"></label>',
      '<span style="position: absolute;top: 2px;right: 9px;color: white;font-size: 10px;"></span>',
      "<br>",
      '<select style="pointer-events: auto;position: absolute;right: 2px;bottom: 28px;"><option>--</option><option>one</option><option>two</option></select>',
      '<input type="text" value="I\'m HTML input" style="pointer-events: auto;position: absolute;bottom: 0;left: 0;right: 0;border: none;color: #333;padding: 5px;height: 16px;width: 100%;">',
      "</div>",
    ].join("");
  }

  private rectangle() {
    return '<div style="border: 1px solid blue; height: 30px; width: 60px; background-color:white"></div>';
  }

  public customizeJoint() {
    joint.shapes["html"] = {};
    joint.shapes["html"].Rect = joint.shapes.basic.Rect.extend({
      defaults: joint.util.defaultsDeep(
        {
          type: "html.Rect",
          attrs: {
            rect: { stroke: "none", "fill-opacity": 0 },
          },
        },
        joint.shapes.basic.Rect.prototype.defaults
      ),
    });

    joint.shapes["html"].RectView = joint.dia.ElementView.extend({
      template: ["<div>", "<p></p>", "</div>"].join(""),
      initialize: function () {
        _.bindAll(this, "updateBox");
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        this.model.on("change", this.updateBox, this);
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
        let bbox = this.model.getBBox();
        this.$box.find("p").text(this.model.attributes.attrs.label.text);
        let { left, top } = $("#canvas").offset();
        this.$box.css({
          width: bbox.width,
          height: bbox.height,
          left: left + bbox.x,
          top: top + bbox.y,
          transform: "rotate(" + (this.model.get("angle") || 0) + "deg)",
          position: "absolute",
          background: "#C9D72B",
          "pointer-events": "none",
          "-webkit-user-select": "none",
          "border-radius": "10px",
          border: "2px solid rgb(0, 0, 0)",
          padding: "5px",
          "box-sizing": "border-box",
          "z-index": 2,
        });
      },
      removeBox: function () {
        this.$box.remove();
      },
    });

    joint.shapes["html"].Pacman = joint.shapes.basic.Circle.extend({
      defaults: joint.util.defaultsDeep(
        {
          type: "html.Pacman",
          attrs: {
            circle: { stroke: "none", "fill-opacity": 0.0 },
          },
        },
        joint.shapes.basic.Circle.prototype.defaults
      ),
    });

    joint.shapes["html"].PacmanView = joint.dia.ElementView.extend({
      template: [
        '<div class="outline">',
        '<div class="pacman">',
        "</div>",
        "</div>",
      ].join(""),
      initialize: function () {
        _.bindAll(this, "updateBox");
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        this.model.on("change", this.updateBox, this);
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
        let bbox = this.model.getBBox();
        let { left, top } = $("#canvas").offset();
        this.$box.css({
          width: bbox.width,
          height: bbox.height,
          left: bbox.x + left,
          top: bbox.y + top,
          transform: "rotate(" + (this.model.get("angle") || 0) + "deg)",
          position: "absolute",
          // 'z-index': 3,
          "pointer-events": "none",
          "-webkit-user-select": "none",
          border: "2px solid black",
          "border-radius": "8px",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          background: "#a9ff00e0",
        });

        this.$box.find(".pacman").css({
          width: "0px",
          height: "0px",
          "border-right": "50px solid transparent",
          "border-top": "50px solid red",
          "border-left": "50px solid red",
          "border-bottom": "50px solid red",
          "border-top-left-radius": "50px",
          "border-top-right-radius": "50px",
          "border-bottom-left-radius": "50px",
          "border-bottom-right-radius": "50px",
        });
      },
      removeBox: function () {
        this.$box.remove();
      },
    });

    joint.elementTools["LinkButton"] = joint.elementTools.Button.extend({
      name: "link-button",
      options: {
        markup: [
          {
            tagName: "circle",
            selector: "button",
            attributes: {
              r: 7,
              fill: "#001DFF",
              cursor: "pointer",
            },
          },
          {
            tagName: "path",
            selector: "icon",
            attributes: {
              d: "M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4",
              fill: "none",
              stroke: "#FFFFFF",
              "stroke-width": 2,
              "pointer-events": "none",
            },
          },
        ],
        x: "100%",
        y: "100%",
        offset: {
          x: 0,
          y: 0,
        },
        rotate: true,
        action: function (evt) {
          // alert('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
          let newLink = new joint.shapes.standard.Link();
          newLink.source(this.model);
          newLink.connector("smooth");
          let graph = this.paper.model as joint.dia.Graph;
          let element = this.model as joint.dia.Element;
          let position = element.attributes.position as joint.g.Point;
          let modelSize = this.model.get("size");
          newLink.target(
            new joint.g.Point(modelSize.width + position.x + 50, position.y)
          );
          newLink.addTo(graph);
        },
      },
    });

    // this.customElement("Element", this.rectangle());

    this.customElement("Element", this.elementTemplate());

    this.customElement("Email", this.emailTemplate());
  }

  private customElement(elementName, template) {
    joint.shapes["html"][elementName] = joint.shapes.basic.Rect.extend({
      defaults: joint.util.defaultsDeep(
        {
          type: "html." + elementName,
          attrs: {
            rect: { stroke: "none", "fill-opacity": 0 },
          },
        },
        joint.shapes.basic.Rect.prototype.defaults
      ),
    });

    joint.shapes["html"][elementName + "View"] = joint.dia.ElementView.extend({
      template,

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
        let bbox = this.model.getBBox();
        let offset = $("#canvas").offset();

        // Example of updating the HTML with a data stored in the cell model.
        this.$box.find("label").text(this.model.get("label"));
        this.$box.find("span").text(this.model.get("select"));
        this.$box.css({
          width: bbox.width - 5,
          height: bbox.height - 5,
          left: offset.left + bbox.x + 2.5,
          top: offset.top + bbox.y + 2.5,
        });
      },
      removeBox: function (evt) {
        this.$box.remove();
      },
    });
  }
}
