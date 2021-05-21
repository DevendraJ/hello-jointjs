import { Injectable } from "@angular/core";
import * as joint from "jointjs/dist/joint";
import * as $ from "jquery";
import * as _ from "underscore";

@Injectable({
  providedIn: "root",
})
export class JointJsService {
  constructor() {}

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
          newLink.target(new joint.g.Point(position.x + 100, position.y ));
          newLink.addTo(graph);
        },
      },
    });
  }
}
