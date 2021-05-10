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
    this.graph = new joint.dia.Graph();

    this.paper = new joint.dia.Paper({
      el: '#canvas',
      model: this.graph,
      width: '100%',
      height: window.innerHeight,
      gridSize: 1,
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

  }

}
