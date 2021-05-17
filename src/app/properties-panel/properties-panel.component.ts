import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties-panel',
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.css']
})
export class PropertiesPanelComponent implements OnInit {

  @Input()
  private inputElement: joint.dia.Element;

  private labelText;

  constructor() { }

  ngOnInit() {
    let labelAttr = this.inputElement.attributes.attrs['label'];
    if (labelAttr && labelAttr['text']) {
      this.labelText = labelAttr['text'];
    } else {
      this.labelText = '';
    }
  }

  updateModel(val) {
    this.inputElement.attr('label/text', val);
  }

}
