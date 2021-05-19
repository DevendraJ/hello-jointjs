import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-properties-panel",
  templateUrl: "./properties-panel.component.html",
  styleUrls: ["./properties-panel.component.css"],
})
export class PropertiesPanelComponent implements OnInit {
  @Input()
  private inputElement: joint.dia.Element;

  public panelForm: FormGroup;
  private isCircle = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.subscribeChanges();
  }

  private initializeForm() {
    this.isCircle = this.inputElement.get("type") === "standard.Circle";

    let labelText: String = "";
    let labelFill = "white";
    let labelAttr = this.inputElement.attributes.attrs["label"];
    if (labelAttr && labelAttr["text"]) {
      labelText = labelAttr["text"];
    }
    if (labelAttr && labelAttr["fill"]) {
      labelFill = labelAttr["fill"];
    }

    let { width, height } = this.inputElement.size();

    this.panelForm = this.fb.group({
      labelText: [labelText],
      labelFill: [labelFill],
      strokeColor: [this.inputElement.attributes.attrs.body.stroke],
      fillColor: [this.inputElement.attributes.attrs.body.fill],
      width: [width],
      height: [height],
      radius: [width / 2],
    });
  }

  subscribeChanges() {
    this.panelForm.get("labelText").valueChanges.subscribe((val) => {
      this.inputElement.attr("label/text", val);
    });

    this.panelForm.get("labelFill").valueChanges.subscribe((val) => {
      this.inputElement.attr("label/fill", val);
    });

    this.panelForm.get("strokeColor").valueChanges.subscribe((val) => {
      this.inputElement.attr("body/stroke", val);
    });

    this.panelForm.get("fillColor").valueChanges.subscribe((val) => {
      this.inputElement.attr("body/fill", val);
    });

    this.panelForm.get("width").valueChanges.subscribe((val) => {
      let { height } = this.inputElement.size();
      this.inputElement.resize(val, height);
    });

    this.panelForm.get("height").valueChanges.subscribe((val) => {
      let { width } = this.inputElement.size();
      this.inputElement.resize(width, val);
    });

    this.panelForm.get("radius").valueChanges.subscribe((val) => {
      this.inputElement.resize(val * 2, val * 2);
    });
  }
}
