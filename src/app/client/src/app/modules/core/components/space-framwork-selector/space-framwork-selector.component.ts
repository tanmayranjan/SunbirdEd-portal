import { Subscription } from 'rxjs';
import { IConceptData } from './../../interfaces';
import { ConceptPickerService } from '../../services';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-space-framwork-selector',
  templateUrl: './space-framwork-selector.component.html',
  styleUrls: ['./space-framwork-selector.component.scss']
})
export class SpaceFramworkSelectorComponent implements OnInit {

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
    if (this.contentConcepts.length === 0) {
      this.pickerMessage = 'Select';
    } else if ( this.contentConcepts.length > 0 ) {
      this.pickerMessage = this.contentConcepts.length + '  selected';

    }
    $('.tree-picker-selector').val(this.pickerMessage);
    setTimeout(() => {
      $('.tree-picker-selector').treePicker({
        data: this.conceptData,
        name: 'Framework',
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
        nodeName: 'framework',
        minSearchQueryLength: 1
      });
      setTimeout(() => {
        document.getElementById('framework').classList.add(this.conceptPicker);
      }, 100);
    }, 100);
  }
  /**
   * calls conceptPickerService and initConceptBrowser
   */
  ngOnInit() {
console.log('framework');
    this.conceptData = this.loadDomains(this.category);
      if (this.selectedConcept) {
        const selectedTopics = _.reduce(this.selectedConcept, (collector, element) => {
          if (typeof element === 'string') {
            collector.unformatted.push(element);
          } else if (_.get(element, 'identifier')) {
            collector.formated.push(element);
          }
          return collector;
        }, { formated: [], unformatted: [] });
        this.formatSelectedTopics(this.conceptData, selectedTopics.unformatted, selectedTopics.formated);
        this.selectedConcept =  selectedTopics.formated;
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
