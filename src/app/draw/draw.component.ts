import { Component, OnInit } from '@angular/core';
import * as joint from 'jointjs/dist/joint';
import * as _ from 'underscore';
import * as $ from 'jquery'

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements OnInit {

  private graph: joint.dia.Graph;
  private paper: joint.dia.Paper;
  private rect: joint.shapes.standard.Rectangle;
  private rect2: joint.shapes.standard.Rectangle;
  private link: joint.shapes.standard.Link;

  constructor() {

  }

  ngOnInit() {
    joint.shapes['html'] = {};
    joint.shapes['html'].Rect = joint.shapes.basic.Rect.extend({
      defaults: joint.util.defaultsDeep({
        type: 'html.Rect',
        attrs: {
          rect: { stroke: 'none', 'fill-opacity': 0 }
        }
      }, joint.shapes.basic.Rect.prototype.defaults)
    });

    joint.shapes['html'].RectView = joint.dia.ElementView.extend({
      template: [
        '<div class="html-element">',
        'Html Rectangle',
        '</div>'
      ].join(''),
      initialize: function () {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        this.model.on('change', this.updateBox, this);
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
        
        this.$box.css({
          width: bbox.width,
          height: bbox.height,
          left: bbox.x,
          top: bbox.y,
          transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)',
          position: 'absolute',
          background: '#C9D72B',
          'pointer-events': 'none',
          '-webkit-user-select': 'none',
          'border-radius': '10px',
          border: '2px solid rgb(0, 0, 0)',
          padding: '5px',
          'box-sizing': 'border-box',
          'z-index': 2,
        });
      },

    });

    this.graph = new joint.dia.Graph({}, {
      cellNamespace: joint.shapes,
    });

    this.paper = new joint.dia.Paper({
      el: '#canvas',
      model: this.graph,
      width: '100%',
      height: window.innerHeight,
      cellViewNamespace: joint.shapes,
      gridSize: 30,
      drawGrid: true,
      background: {
        color: '#D1C9C8'
      },
    });

    this.rect = new joint.shapes.standard.Rectangle();
    this.rect.position(100, 30);
    this.rect.resize(100, 40);
    this.rect.attr({
      body: {
        fill: '#F6A11B'
      },
      label: {
        text: 'Hello',
        fill: 'white'
      }
    });
    this.rect.addTo(this.graph);

    this.rect2 = this.rect.clone() as joint.shapes.standard.Rectangle;
    this.rect2.translate(600, 70);
    // this.rect2.position(500, 30);
    this.rect2.attr('body/fill', '#1CC1EF');
    this.rect2.attr('label/text', 'World!');
    this.rect2.addTo(this.graph);

    this.link = new joint.shapes.standard.Link();
    this.link.source(this.rect);
    this.link.target(this.rect2);
    this.link.connector('smooth')
    this.link.attr({
      line: {
        stroke: 'red',
      }
    });
    this.link.appendLabel({
      attrs: {
        text: {
          text: 'Label'
        }
      }
    })
    this.link.addTo(this.graph);

    this.paper.on({
      'link:pointermove': function (elementView, evt, x, y) {
        let coordinates = new joint.g.Point(x, y);
        let link = (elementView.model as joint.shapes.standard.Link);
        let source = link.source();
        link.disconnect();
        link.source(source);

        let elementBelow = this.model.findModelsFromPoint(coordinates).find(function (el) {
          return (el.id !== link.id);
        });

        if (elementBelow) {
          link.target(elementBelow);
        } else {
          link.target(coordinates);
        }

      },

    });

    var customShape = new joint.shapes['html'].Rect({
      position: { x: 80, y: 80 },
      size: { width: 170, height: 100 },
    });
    customShape.addTo(this.graph);

    var link2 = new joint.shapes.standard.Link();
    link2.source(this.rect);
    link2.target(customShape);
    link2.addTo(this.graph);
    link2.connector('smooth');

    // console.log(JSON.stringify(this.graph.toJSON()))

    // var jsonStr = '{"cells":[{"type":"standard.Rectangle","position":{"x":100,"y":30},"size":{"width":100,"height":40},"angle":0,"id":"76f6036c-362d-4cff-9980-fd31eb9da342","z":1,"attrs":{"body":{"fill":"#F6A11B"},"label":{"fill":"white","text":"Hello"}}},{"type":"standard.Rectangle","position":{"x":700,"y":100},"size":{"width":100,"height":40},"angle":0,"id":"66cb4310-5c4e-40c9-8f04-950217969856","z":1,"attrs":{"body":{"fill":"#1CC1EF"},"label":{"fill":"white","text":"World!"}}},{"type":"standard.Link","source":{"id":"76f6036c-362d-4cff-9980-fd31eb9da342"},"target":{"id":"66cb4310-5c4e-40c9-8f04-950217969856"},"id":"14cb0118-363b-4059-b0f5-a953a2b1cc6c","connector":{"name":"smooth"},"labels":[{"attrs":{"text":{"text":"Label"}}}],"z":2,"attrs":{"line":{"stroke":"red"}}},{"type":"html.Element","position":{"x":80,"y":80},"size":{"width":170,"height":100},"angle":0,"id":"1015f094-53d5-4c05-b74b-7e7dbf0989e5","z":3,"attrs":{}},{"type":"standard.Link","source":{"id":"76f6036c-362d-4cff-9980-fd31eb9da342"},"target":{"id":"1015f094-53d5-4c05-b74b-7e7dbf0989e5"},"id":"60336507-e5af-4ec2-8947-b165dcdf0c2a","z":4,"connector":{"name":"smooth"},"attrs":{}}]}';
    // var json = JSON.parse(jsonStr)
    // this.graph.fromJSON(json);
  }

}
