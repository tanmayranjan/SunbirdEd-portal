import { ResourceService } from './../../services/resource/resource.service';
import { Component, OnInit, ChangeDetectorRef, Input,  EventEmitter, Output, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-space-custom-multi-select',
  templateUrl: './space-custom-multi-select.component.html',
  styleUrls: ['./space-custom-multi-select.component.scss']
})
export class SpaceCustomMultiSelectComponent implements OnInit {
  @Input() inputData: Array<string>;
  @Input() field: object;
  @Input() valueField = 'name';
  checkBox: object;
  selectAllCheckBox = false;
  refresh = true;
  placeholder = '';
  @Output() selectedValue = new EventEmitter<any>();

  constructor( private cdr: ChangeDetectorRef, public resourceService: ResourceService) { }
  checkbox(name) {
    if (this.checkBox[name]) {
      this.checkBox[name] = false;
      this.selectAllCheckBox = false;
    } else {
      this.checkBox[name] = true;
    }
  }
  selectAll(code) {
    this.placeholder = 'Selected';
    this.inputData = [];
    this.selectAllCheckBox = !this.selectAllCheckBox;
    if (this.selectAllCheckBox) {
      _.forEach(this.field['range'], (value) => {
        this.inputData.push(value.name);
        this.checkBox[value.name] = true;
      });
    } else {
      this.placeholder = '';
      this.inputData = [];
      _.forEach(this.field['range'], (value) => {
        this.checkBox[value.name] = false;
      });
    }
    this.selectedValue.emit( this.inputData);
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }
  selectedOption(event) {
    this.placeholder = 'Selected';
    if (event.length === 0) {
      this.placeholder = '';
    }
    const fieldName = [];
    _.forEach(this.field['range'], (value, key) => {
      // console.log('value in selected checkbox = ', value, key, event);
      fieldName.push(value.name);
    });
    if (fieldName.length === event.length) {
      this.selectAllCheckBox = true;
    }
    this.selectedValue.emit(event);
  }
  ngOnInit() {
    console.log('fields = ', this.field);
    this.checkBox = {};
    const name = [];
    if (this.inputData) {
      _.forEach(this.field['range'], (value, key) => {
        name.push(value.name);
      });
      if (name.length === this.inputData.length) {
        this.selectAllCheckBox = true;
      }
      _.forEach(this.inputData, (value) => {
        this.checkBox[value] = true;
      });
    }
  }
}
