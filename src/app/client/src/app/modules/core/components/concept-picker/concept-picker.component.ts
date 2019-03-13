import { Subscription } from 'rxjs';
import { IConceptData } from './../../interfaces';
import { ConceptPickerService } from './../../services';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-concept-picker',
  templateUrl: './concept-picker.component.html',
  styleUrls: ['./concept-picker.component.css']
})
export class ConceptPickerComponent implements OnInit {
  private conceptPickerService: ConceptPickerService;
  /**
   * concept Data
   */
  conceptData: Array<IConceptData>;
  /**
   * selectedConcepts Data
   */
  @Input() selectedConcepts: any;
  /**
   * class for concept picker
   */
  @Input() conceptPickerClass: string;

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
  @Output() Concepts = new EventEmitter();
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
    debugger;
    console.log('this', this.selectedConcepts)
    this.selectedConcepts = this.selectedConcepts || [];
    this.contentConcepts = _.map(this.selectedConcepts, 'name');
    console.log('thi.cone', this.contentConcepts);
    this.pickerMessage = this.contentConcepts.length + 'selected';
    $('.tree-pickers').val(this.pickerMessage);
    setTimeout(() => {
      $('.tree-pickers').treePicker({
        data: this.conceptData,
        name: 'sector',
        picked: this.contentConcepts,
        onSubmit: (nodes) => {
          $('.tree-pickers').val(nodes.length + 'selected');
          const contentConcepts = [];
          _.forEach(nodes, (obj) => {
            contentConcepts.push({
              identifier: obj.id,
              name: obj.name
            });
          });
          this.selectedConcepts = contentConcepts;
          this.Concepts.emit(this.selectedConcepts);
        },
        nodeName: 'conceptSelector_treePicker',
        minSearchQueryLength: 1
      });
      setTimeout(() => {
        document.getElementById('conceptSelector_treePicker').classList.add(this.conceptPickerClass);
      }, 9000);
    }, 9000);
  }
  /**
   * calls conceptPickerService and initConceptBrowser
   */
  ngOnInit() {
    console.log('concept picker', this.selectedConcepts);
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


  // ngOnDestroy() {
  //   if (this.conceptData) {
  //     this.conceptData = null;
  //   }
  // }
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
