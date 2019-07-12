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
    this.selectedConcepts = this.selectedConcepts || [];
    this.contentConcepts = _.map(this.selectedConcepts, 'identifier');
    if (this.contentConcepts.length === 0) {
      this.pickerMessage = 'Select';
    } else if ( this.contentConcepts.length > 0 ) {
      this.pickerMessage = this.contentConcepts.length + '  selected';

    }
    $('.tree-pickers').val(this.pickerMessage);
    setTimeout(() => {

      $('.tree-pickers').treePicker({
        data: this.conceptData,
        name: 'sector',
        picked: this.contentConcepts,
        onSubmit: (nodes) => {
          $('.tree-pickers').val(nodes.length + ' selected');
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
      }, 100);
    }, 100);
  }
  /**
   * calls conceptPickerService and initConceptBrowser
   */
  ngOnInit() {

    this.conceptData = this.loadDomains(this.category);
    if (this.selectedConcepts) {
    const selectedTopics = _.reduce(this.selectedConcepts, (collector, element) => {
      if (typeof element === 'string') {
        collector.unformatted.push(element);
      } else if (_.get(element, 'identifier')) {
        collector.formated.push(element);
      }
      return collector;
    }, { formated: [], unformatted: [] });
    this.formatSelectedTopics(this.conceptData, selectedTopics.unformatted, selectedTopics.formated);
    this.selectedConcepts =  selectedTopics.formated;
    }


    if (this.conceptData) {
      this.showLoader = false;
          this.initConceptBrowser();
        } else {
          this.showLoader = false;
    }

    }
    private formatSelectedTopics(topics, unformatted, formated) {
      _.forEach(topics, (topic) => {
        if (unformatted.includes(topic.name)) {
          formated.push({
            identifier: topic.id,
            name: topic.name
          });
        }
        if (topic.nodes) {
          this.formatSelectedTopics(topic.nodes, unformatted, formated);
        }
      });
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
