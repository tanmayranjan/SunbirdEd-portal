import { Subscription } from 'rxjs';
import { IConceptData } from './../../interfaces';
import { ConceptPickerService } from './../../services';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-framwork-selector',
  templateUrl: './framwork-selector.component.html',
  styleUrls: ['./framwork-selector.component.scss']
})
export class FramworkSelectorComponent implements OnInit {

  private conceptPickerService: ConceptPickerService;
  /**
   * concept Data
   */
  conceptData: Array<IConceptData>;
  /**
   * selectedConcepts Data
   */
  @Input() selectedConcept: any;
  /**
   * class for concept picker
   */
  @Input() conceptPicker: string;

  @Input() category: any;

  @Input() categoryName: string;
  /**
   * message about how many concept are selected
   */
  pickerMessage: string;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  contentConcepts: any;
  conceptDataSubscription: Subscription;
  conceptDataSet: any;
  /**
   * emits selected concepts
   */
  @Output() Framework = new EventEmitter();
  /**
    * Constructor to create injected service(s) object
    * Default method of Draft Component class
    * @param {ConceptPickerService} conceptPickerService Reference of ConceptPickerService
  */
  constructor(conceptPickerService: ConceptPickerService) {
    this.conceptPickerService = conceptPickerService;
  }
  /**
   * call tree picker
   */
  initConceptBrowser() {
    this.selectedConcept = this.selectedConcept || [];
    this.contentConcepts = _.map(this.selectedConcept, 'identifier');
    this.pickerMessage = this.contentConcepts.length + 'selected';
    $('.tree-picker-selector').val(this.pickerMessage);
    setTimeout(() => {
      $('.tree-picker-selector').treePicker({
        data: this.conceptData,
        name: this.categoryName,
        picked: this.contentConcepts,
        onSubmit: (nodes) => {
          $('.tree-picker-selector').val(nodes.length + ' selected');
          const contentConcepts = [];
          _.forEach(nodes, (obj) => {
            contentConcepts.push({
              identifier: obj.id,
              name: obj.name
            });
          });
          this.selectedConcept = contentConcepts;
          this.Framework.emit(this.selectedConcept);
        },
        nodeName: 'conceptSelector',
        minSearchQueryLength: 1
      });
      setTimeout(() => {
        document.getElementById('conceptSelector').classList.add(this.conceptPicker);
      }, 500);
    }, 500);
  }
  /**
   * calls conceptPickerService and initConceptBrowser
   */
  ngOnInit() {
    console.log('selected', this.selectedConcept);
    console.log('concept picker', this.selectedConcept);
    this.conceptData = this.loadDomains(this.category);
    if (this.conceptData) {
      this.showLoader = false;
          console.log('our ', this.category);
          console.log('this.node', this.conceptData);

          this.initConceptBrowser();
        } else {
          this.showLoader = false;
    }

    }

  loadDomains(cat) {
    const domains = [];
        if (cat && _.isArray(cat)) {
          _.forEach(cat, (value) => {
            const domain = {};
            domain['id'] = value['identifier'];
            domain['name'] = value['name'];
            domain['selectable'] = 'selectable';
            domain['nodes'] = this.getChild(value.identifier, value.children);
            domains.push(domain);
          });
          console.log('no', domains);
        }
        return domains;
      }
  /**
   *  Get child recursively
   */
  getChild(id, resp) {
    const childArray = [];
    _.forEach(resp, (value) => {
          const child = {};
          child['id'] = value['identifier'];
          child['name'] = value['name'];
          child['selectable'] = 'selectable';
          childArray.push(child);
    });
    return _.uniqBy(childArray, 'id');
  }

}
