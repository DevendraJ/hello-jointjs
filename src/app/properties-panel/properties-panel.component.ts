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

  private labelText: string;
  private fill: string;
  private stroke: string;

  public panelProperyForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  private initializeForm() {
    this.panelProperyForm = this.fb.group({
      label: [null, []],
      stroke: [null, []],
      fill: [null, []],
    });
  }

  ngOnInit() {
    this.initProps();
    this.initializeForm();
  }

  initProps() {
    let labelAttr = this.inputElement.attributes.attrs["label"];
    if (labelAttr && labelAttr["text"]) {
      this.labelText = labelAttr["text"];
    } else {
      this.labelText = "";
    }

    this.stroke = this.inputElement.attributes.attrs.body.stroke;
    this.fill = this.inputElement.attributes.attrs.body.fill;
  }

  updateModel() {
    this.inputElement.attr("label/text", this.labelText);
    this.inputElement.attr("body/stroke", this.stroke);
    this.inputElement.attr("body/fill", this.fill);
  }
}
