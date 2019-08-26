import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash-es';
import { Subscription } from 'rxjs';
import { ResourceService } from '@sunbird/shared';
import * as  treePicker from './../../../../../assets/libs/semantic-ui-tree-picker/semantic-ui-tree-picker';
import { tap } from 'rxjs/operators';
$.fn.treePicker = treePicker;
interface TopicTreeNode {
  id: string;
  name: string;
  selectable: string;
  nodes: Array<TopicTreeNode>;
}
@Component({
  selector: 'app-topic-picker',
  templateUrl: './topic-picker.component.html',
  styleUrls: ['./topic-picker.component.scss']
})
export class TopicPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('topic') public topic: ElementRef;

  @Input() key: any;

  @Input() formTopic: any;

  @Input() selectedTopics: any;

  @Input() topicPickerClass: string;

  @Output() topicChange = new EventEmitter();

  public placeHolder: string;

  public selectedNodes: any;

  resourceDataSubscription: Subscription;
  public nodeName: string;
  public name: string;
  public count = 0 ;
  constructor(public resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
  ngOnInit() {
    // console.log('topic picker = ', this.topic.nativeElement.classList[0], this.topic, this.key);
    if (this.key === 'topic') {
      this.nodeName = 'topic';
      this.name = 'Framework';
    }
    if (this.key === 'framework') {
      this.nodeName = 'framework';
      this.name = 'Sector';
    }
    if (this.key === 'topicPicker') {
      this.nodeName = 'topic';
      this.name = 'Topic';
    }
    const selectedTopics = _.reduce(this.selectedTopics, (collector, element) => {
      if (typeof element === 'string') {
        collector.unformatted.push(element);
      } else if (_.get(element, 'identifier')) {
        collector.formated.push(element);
      }
      return collector;
    }, { formated: [], unformatted: [] });
    this.formatSelectedTopics(this.formTopic.range, selectedTopics.unformatted, selectedTopics.formated);
    this.selectedTopics =  selectedTopics.formated;
    this.selectedNodes = {...selectedTopics.formated};
    this.topicChange.emit(this.selectedTopics);
    this.resourceDataSubscription = this.resourceService.languageSelected$
      .pipe(
        tap(() => {
          const selectedTopics = _.reduce(this.selectedTopics, (collector, element) => {
            if (typeof element === 'string') {
              collector.unformatted.push(element);
            } else if (_.get(element, 'identifier')) {
              collector.formated.push(element);
            }
            return collector;
          }, { formated: [], unformatted: [] });
          this.formatSelectedTopics(this.formTopic.range, selectedTopics.unformatted, selectedTopics.formated);
          this.selectedTopics = selectedTopics.formated;
          this.selectedNodes = { ...selectedTopics.formated };
          this.topicChange.emit(this.selectedTopics);
        })
      )
      .subscribe(item => {
        this.initTopicPicker(this.formatTopics(this.formTopic.range));
        this.placeHolder = this.selectedTopics.length + ' ' + this.resourceService.frmelmnts.lbl.topics +
          ' ' + this.resourceService.frmelmnts.lbl.selected;
      }
    );
    // this.initTopicPicker(this.formatTopics(this.formTopic.range));

  }
  private formatSelectedTopics(topics, unformatted, formated) {
    _.forEach(topics, (topic) => {
      if (unformatted.includes(topic.name) && !topic.children) {
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
    this.initTopicPicker(this.formatTopics(this.formTopic.range));
  }
  private initTopicPicker(data: Array<TopicTreeNode>) {
    jQuery('.topic-picker-selector').treePicker({
      data: data,
      name: this.name,
      count: this.count,
      noDataMessage: this.resourceService.messages.fmsg.m0089,
      submitButtonText: this.resourceService.frmelmnts.lbl.done,
      cancelButtonText: this.resourceService.frmelmnts.btn.cancelCapitalize,
      removeAllText: this.resourceService.frmelmnts.lbl.removeAll,
      chooseAllText: this.resourceService.frmelmnts.lbl.chooseAll,
      searchText: this.resourceService.frmelmnts.prmpt.search,
      selectedText: this.resourceService.frmelmnts.lbl.selected,
      picked: _.map(this.selectedNodes, 'identifier'),
      onSubmit: (selectedNodes) => {
        this.selectedNodes = selectedNodes;
        this.selectedTopics = _.map(selectedNodes, node => ({
          identifier: node.id,
          name: node.name
        }));
        this.placeHolder = this.selectedTopics.length + ' topics selected';
        this.topicChange.emit(this.selectedTopics);
      },
      nodeName: this.nodeName,
      minSearchQueryLength: 1
    });
    setTimeout(() =>
    document.getElementById(this.nodeName).classList.add(this.topicPickerClass), 100);

  }
  private formatTopics(topics, subTopic = false): Array<TopicTreeNode> {
    return _.map(topics, (topic) => ({
      id: topic.identifier,
      name: topic.name,
      selectable: subTopic ? 'selectable' : 'notselectable',
      nodes: this.formatTopics(topic.children, true)
    }));
  }
  ngOnDestroy() {
    if (this.resourceDataSubscription) {
      this.resourceDataSubscription.unsubscribe();
    }
  }
}
