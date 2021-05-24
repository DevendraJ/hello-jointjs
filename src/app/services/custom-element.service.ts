import { Injectable } from "@angular/core";
import * as joint from "jointjs/dist/joint";
@Injectable({
  providedIn: "root",
})
export class CustomElementService {
  private attributes = {
    attrs: {
      c: {
        strokeWidth: 1,
        stroke: "#000000",
        fill: "rgba(0,0,255,0.3)",
      },
    },
  };

  private markups = {
    markup: [
      {
        tagName: "circle",
        selector: "c",
      },
    ],
  };

  constructor() {
    joint.dia.Element.define(
      "examples.CustomElement",
      {
        attrs: {
          e: {
            strokeWidth: 1,
            stroke: "#000000",
            fill: "rgba(255,0,0,0.3)",
          },
          r: {
            strokeWidth: 1,
            stroke: "#000000",
            fill: "rgba(0,255,0,0.3)",
          },
          c: {
            strokeWidth: 1,
            stroke: "#000000",
            fill: "rgba(0,0,255,0.3)",
          },
          outline: {
            refX: 0,
            refY: 0,
            refWidth: "100%",
            refHeight: "100%",
            strokeWidth: 1,
            stroke: "#000000",
            strokeDasharray: "5 5",
            strokeDashoffset: 2.5,
            fill: "none",
          },
        },
      },
      {
        markup: [
          {
            tagName: "ellipse",
            selector: "e",
          },
          {
            tagName: "rect",
            selector: "r",
          },
          {
            tagName: "circle",
            selector: "c",
          },
          {
            tagName: "rect",
            selector: "outline",
          },
        ],
      }
    );
  }

  public create() {}
}
