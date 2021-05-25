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

  public stylesForm: FormGroup;
  public propsForm: FormGroup;

  private isCircle: boolean = false;
  private isCustomShape: boolean = false;

  constructor(private fb: FormBuilder) {    
  }

  ngOnInit() {
    this.initializeForm();
    this.subscribeChanges();
  }

  private initializeForm() {
    let type = this.inputElement.get("type");
    this.isCustomShape = type.split(".")[0] !== "standard";

    let strokeColor = "";
    let fillColor = "";
    if (!this.isCustomShape) {
      this.isCircle = type === "standard.Circle";
      strokeColor = this.inputElement.attributes.attrs.body.stroke;
      fillColor = this.inputElement.attributes.attrs.body.fill;
    }

    let shapeLabel: String = this.inputElement.get("shapeLabel");
    let mailFrom: String = this.inputElement.get("mailFrom");
    let mailTo: String = this.inputElement.get("mailTo");

    this.propsForm = this.fb.group({
      shapeLabel: [shapeLabel],
      mailFrom: [mailFrom],
      mailTo: [mailTo]
    });

    let { width, height } = this.inputElement.size();
    let stroke = null;
    let fill = null;
    if (this.inputElement.attributes.attrs.body) {
      stroke = this.inputElement.attributes.attrs.body.stroke;
      fill = this.inputElement.attributes.attrs.body.fill;
    }

    this.stylesForm = this.fb.group({
      strokeColor: [strokeColor],
      fillColor: [fillColor],
      width: [width],
      height: [height],
      radius: [width / 2],
    });
    
  }

  subscribeChanges() {
    this.propsForm.get("shapeLabel").valueChanges.subscribe((val) => {
      this.inputElement.set("shapeLabel", val);
    });

    this.propsForm.get("mailFrom").valueChanges.subscribe((val) => {
      this.inputElement.set("mailFrom", val);
    });

    this.propsForm.get("mailTo").valueChanges.subscribe((val) => {
      this.inputElement.set("mailTo", val);
    });

    this.stylesForm.get("strokeColor").valueChanges.subscribe((val) => {
      this.inputElement.attr("body/stroke", val);
    });

    this.stylesForm.get("fillColor").valueChanges.subscribe((val) => {
      this.inputElement.attr("body/fill", val);
    });

    this.stylesForm.get("width").valueChanges.subscribe((val) => {
      let { height } = this.inputElement.size();
      this.inputElement.resize(val, height);
    });

    this.stylesForm.get("height").valueChanges.subscribe((val) => {
      let { width } = this.inputElement.size();
      this.inputElement.resize(width, val);
    });

    this.stylesForm.get("radius").valueChanges.subscribe((val) => {
      this.inputElement.resize(val * 2, val * 2);
    });
  }
}
