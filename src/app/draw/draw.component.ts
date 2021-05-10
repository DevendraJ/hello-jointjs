import { Component, OnInit } from '@angular/core';
import * as joint from 'jointjs/dist/joint';

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
    this.graph = new joint.dia.Graph({}, {
      cellNamespace: joint.shapes,
    });

    this.paper = new joint.dia.Paper({
      el: '#canvas',
      model: this.graph,
      width: '100%',
      height: window.innerHeight,
      gridSize: 1,
      cellViewNamespace: joint.shapes,
    });

    this.rect = new joint.shapes.standard.Rectangle();
    this.rect.position(100, 30);
    this.rect.resize(100, 40);
    this.rect.attr({
      body: {
        fill: 'blue'
      },
      label: {
        text: 'Hello',
        fill: 'white'
      }
    });
    this.rect.addTo(this.graph);

    this.rect2 = this.rect.clone() as joint.shapes.standard.Rectangle;
    // rect2.translate(300, 0);
    this.rect2.position(500, 30);
    this.rect2.attr('label/text', 'World!');
    this.rect2.addTo(this.graph);

    this.link = new joint.shapes.standard.Link();
    this.link.source(this.rect);
    this.link.target(this.rect2);
    this.link.addTo(this.graph);

    // console.log(JSON.stringify(this.graph.toJSON()))

    // var jsonStr = '{"cells":[{"type":"standard.Rectangle","position":{"x":100,"y":30},"size":{"width":100,"height":40},"angle":0,"id":"00a7a266-8df0-4921-b6ea-7614c7433b45","z":1,"attrs":{"body":{"fill":"blue"},"label":{"fill":"white","text":"Hello"}}},{"type":"standard.Rectangle","position":{"x":500,"y":30},"size":{"width":100,"height":40},"angle":0,"id":"2cb58c08-f5f6-4e32-aacb-2267ab8ce62b","z":1,"attrs":{"body":{"fill":"blue"},"label":{"fill":"white","text":"World!"}}},{"type":"standard.Link","source":{"id":"00a7a266-8df0-4921-b6ea-7614c7433b45"},"target":{"id":"2cb58c08-f5f6-4e32-aacb-2267ab8ce62b"},"id":"becdd7d1-c409-4bfd-9520-febf3308019e","z":2,"attrs":{}}]}';
    // var json = JSON.parse(jsonStr)
    // this.graph.fromJSON(json);
  }

}
