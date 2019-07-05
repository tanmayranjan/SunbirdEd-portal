import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, OnDestroy} from '@angular/core';
import * as _ from 'lodash-es';

interface TopicTreeNode {
  id: string;
  name: string;
  selectable: string;
  nodes: Array<TopicTreeNode>;
}

@Component({
  selector: 'app-framework-picker',
  templateUrl: './framework-picker.component.html',
  styleUrls: ['./framework-picker.component.scss']
})
export class FrameworkPickerComponent implements OnInit , AfterViewInit, OnDestroy {

  @Input() formTopics: any;

  @Input() selectedTopics: any;

  @Input() topicPickerClass: string;

  @Output() topicChanges = new EventEmitter();

  public placeHolder: string;

  public selectedNodes: any;

  constructor() {
  }
  ngOnInit() {

    const selectedTopics = _.reduce(this.selectedTopics, (collector, element) => {
      if (typeof element === 'string') {
        collector.unformatted.push(element);
      } else if (_.get(element, 'identifier')) {
        collector.formated.push(element);
      }
      return collector;
    }, { formated: [], unformatted: [] });
    this.formatSelectedTopics(this.formTopics.range, selectedTopics.unformatted, selectedTopics.formated);
    this.selectedTopics = selectedTopics.formated;
    this.selectedNodes = { ...selectedTopics.formated };
    this.topicChanges.emit(this.selectedTopics);
    if (this.selectedTopics.length === 0) {
      this.placeHolder = 'Select';
    } else if (this.selectedTopics.length > 0) {
      this.placeHolder = this.selectedTopics.length + ' selected';
           }
  }
  private formatSelectedTopics(topics, unformatted, formated) {
    _.forEach(topics, (topic) => {
      if (unformatted.includes(topic.name)) {
        formated.push({
          identifier: topic.identifier,
          name: topic.name
        });
      }
      if (topic.children) {
        this.formatSelectedTopics(topic.children, unformatted, formated);
      }
    });
  }
  ngAfterViewInit() {
    this.initTopicPicker(this.formatTopics(this.formTopics.range));
  }
  private initTopicPicker(data: Array<TopicTreeNode>) {
    $('.topic-picker-selectors').treePicker({
      data: data,
      name: 'Sector',
      noDataMessage: 'No Topics/SubTopics found',
      picked: _.map(this.selectedNodes, 'identifier'),
      onSubmit: (selectedNodes) => {
        this.selectedTopics = _.map(selectedNodes, node => ({
          identifier: node.id,
          name: node.name
        }));
        this.placeHolder = this.selectedTopics.length + ' selected';
        this.topicChanges.emit(this.selectedTopics);
      },
      nodeName: 'topicSelectors',
      minSearchQueryLength: 1
    });
    setTimeout(() =>
      document.getElementById('topicSelectors').classList.add(this.topicPickerClass), 200);
  }
  private formatTopics(topics, subTopic = false): Array<TopicTreeNode> {
    return _.map(topics, (topic) => ({
      id: topic.identifier,
      name: topic.name,
      selectable: subTopic ? 'selectable' : 'selectable',
      nodes: this.formatTopics(topic.children, true)
    }));
  }
  ngOnDestroy() {
  }
}
