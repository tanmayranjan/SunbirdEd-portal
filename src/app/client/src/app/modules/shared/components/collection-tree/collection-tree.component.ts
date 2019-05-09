/*
 *
 * Author: Sunil A S<sunils@ilimi.in>
 *
 */

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import * as _ from 'lodash';
import {
  ICollectionTreeNodes,
  ICollectionTreeOptions,
  MimeTypeTofileType,
  IactivityType
} from '../../interfaces';
import { ResourceService } from '../../services/index';
import { b } from '@angular/core/src/render3';
import { constructor } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-collection-tree',
  templateUrl: './collection-tree.component.html',
  styleUrls: ['./collection-tree.component.css']
})
export class CollectionTreeComponent implements OnInit, OnChanges {
  @Input() public nodes: ICollectionTreeNodes;
  @Input() public options: ICollectionTreeOptions;
  @Input() public enrolledDate: any;
  date: Date;
  @Output() public contentSelect: EventEmitter<{
    id: string;
    title: string;
  }> = new EventEmitter();
  @Input() contentStatus: any;
  private rootNode: any;
  public rootChildrens: any;
  open = true;
  private iconColor = {
    '0': 'fancy-tree-grey',
    '1': 'fancy-tree-blue',
    '2': 'fancy-tree-green'
  };
  constructor(public resourceService?: ResourceService) {
    this.resourceService = resourceService;
  }
  ngOnInit() {
    this.initialize();
    console.log('resource ', this.resourceService);
  }

  ngOnChanges() {
    this.initialize();
  }

  public onNodeClick(node: any) {
    if (!node.folder) {
      this.contentSelect.emit({ id: node.id, title: node.title });
    }
  }

  public onItemSelect(item: any) {
    if (!item.folder) {
      this.contentSelect.emit({ id: item.data.id, title: item.title });
    }
  }

  private initialize() {
    this.rootNode = this.createTreeModel();
    if (this.rootNode) {
      this.rootChildrens = this.rootNode.children;
      _.forEach(this.rootChildrens, child => {
        child['togglePanelIcon'] = true;
      });
      console.log('rootChildrens', this.rootChildrens);

      this.addNodeMeta();
    }
  }

  private createTreeModel() {
    if (!this.nodes) {
      return;
    }
    const model = new TreeModel();
    return model.parse(this.nodes.data);
  }
  getRandomNum(minLimit) {
    return (Math.floor(Math.random() * (+6 - +minLimit)) + +minLimit);
  }
  private addNodeMeta() {
    console.log('this.root.node', this.rootNode);
    if (!this.rootNode) { return; }
    this.rootNode.walk((node) => {
      node.fileType = MimeTypeTofileType[node.model.mimeType];
      if (!!node.model.activityType) {
        node.activityType = IactivityType[node.model.activityType];
      }
      node.id = node.model.identifier;
      if (node.children && node.children.length) {
        // node['acticityStart'] = this.getRandomNum(1);
        // node['activityEnd'] = 5
        if (this.enrolledDate) {
          node['startDate'] = moment(this.enrolledDate).add(node.model.activitystart, 'days').format('D MMMM YYYY');
          node['endDate'] = moment(this.enrolledDate).add( node.model.activityend, 'days').format('D MMMM YYYY');
        }
        if (this.options.folderIcon) {
          node.icon = this.options.folderIcon;
        }
        node.folder = true;
      } else {
        if (
          node.fileType ===
          MimeTypeTofileType['application/vnd.ekstep.content-collection']
        ) {
          node.folder = true;
        } else {
          const indexOf = _.findIndex(this.contentStatus, {});
          if (this.contentStatus) {
            const content: any = _.find(this.contentStatus, {
              contentId: node.model.identifier
            });
            const status =
              content && content.status ? content.status.toString() : 0;
            node.iconColor = this.iconColor[status];
          } else {
            node.iconColor = this.iconColor['0'];
          }
          node.folder = false;
        }
        node.icon =
          this.options.customFileIcon[node.fileType] || this.options.fileIcon;
        node.icon = `${node.icon} ${node.iconColor}`;
      }
      if (node.folder && !node.children.length) {
        node.title =
          node.model.name +
          '<strong> (' +
          this.resourceService.messages.stmsg.m0121 +
          ')</strong>';
        node.extraClasses = 'disabled';
      } else {
        node.title = node.model.name || 'Untitled File';
        node.extraClasses = '';
      }
    });
  }
}
