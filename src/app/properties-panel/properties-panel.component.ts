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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
    this.subscribeChanges();
  }

  private initializeForm() {
    let labelText: String = "";
    let labelAttr = this.inputElement.attributes.attrs["label"];
    if (labelAttr && labelAttr["text"]) {
      labelText = labelAttr["text"];
    }

    this.panelForm = this.fb.group({
      labelText: [labelText],
      strokeColor: [
        this.inputElement.attributes.attrs.body.stroke,
      ],
      fillColor: [
        this.inputElement.attributes.attrs.body.fill,
      ],
    });
  }

  subscribeChanges() {
    this.panelForm.get('labelText').valueChanges.subscribe((val) => {
      this.inputElement.attr("label/text", val);
    });

    this.panelForm.get('strokeColor').valueChanges.subscribe((val) => {
      this.inputElement.attr("body/stroke", val);
    });

    this.panelForm.get('fillColor').valueChanges.subscribe((val) => {
      this.inputElement.attr("body/fill", val);
    });
  }

}
