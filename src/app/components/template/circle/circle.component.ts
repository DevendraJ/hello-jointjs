import { Component, HostListener, OnInit } from "@angular/core";

@Component({
  selector: "app-circle",
  templateUrl: "./circle.component.html",
  styleUrls: ["./circle.component.css"],
})
export class CircleComponent implements OnInit {
  @HostListener("click", ["$event.target"])
  onClick(btn) {
    console.log("button is clicked");
  }

  constructor() {}

  ngOnInit() {}
}
