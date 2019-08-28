import { Subscription } from 'rxjs';
import { IConceptData } from './../../interfaces';
import { ConceptPickerService } from './../../services';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-space-concept-picker',
  templateUrl: './space-concept-picker.component.html',
  styleUrls: ['./space-concept-picker.component.scss']
})
export class SpaceConceptPickerComponent implements OnInit {
  private conceptPickerService: ConceptPickerService;
  /**
   * concept Data
   */
  conceptData: Array<IConceptData>;
  @Input() key: string;
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
  placeHolder: any;
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
  public count = 0;
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
    console.log('concept picker');
    if (this.contentConcepts.length === 0) {
      this.pickerMessage = 'Select';
    } else if (this.contentConcepts.length > 0) {
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
        nodeName: 'topic',
        minSearchQueryLength: 1
      });
      // console.log('selector = ',  document.getElementById('conceptSelector_treePicker'), this.selectedConcepts, this.Concepts);
      setTimeout(() => {
        document.getElementById('topic').classList.add(this.conceptPickerClass);
      }, 500);
    }, 500);
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
      this.selectedConcepts = selectedTopics.formated;
    }


    if (this.conceptData) {
      this.showLoader = false;
      this.initConceptBrowser();
    } else {
      this.showLoader = false;
    }
  }

  // }
  private formatSelectedTopics(topics, unformatted, formated) {
    console.log('formate = ', topics, unformatted, formated);
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