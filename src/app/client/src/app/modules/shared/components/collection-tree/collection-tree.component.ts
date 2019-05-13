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
import { ResourceService, ToasterService } from '../../services/index';
import { b, d } from '@angular/core/src/render3';
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
  public children = [];
  public preContent = [];
  public contentsStatus = [];
openLock = false;
  statuscount = 0;
  rootContents = [];
  private iconColor = {
    '0': 'fancy-tree-grey',
    '1': 'fancy-tree-blue',
    '2': 'fancy-tree-green'
  };
  constructor(public resourceService?: ResourceService, public toasterService?: ToasterService) {
    this.resourceService = resourceService;
  }
  ngOnInit() {
    this.initialize();
  }

  ngOnChanges() {
    this.initialize();
  }

  public onNodeClick(node: any) {

    if (!node.folder) {
      this.contentSelect.emit({ id: node.id, title: node.title });
    }
  }
public onNode(node: any) {
const currentRootNodeId = node.model.identifier;
let prevContent;
let contentIds: any;
let prevNodeCount = 0;
_.forOwn(node.model.prerequisite_Data, data => {
  _.forOwn(this.rootContents, (data1: any) => {
if (data === data1.name) {
contentIds = data1.id;
}
  });
    });
 _.forOwn(this.preContent, (content, key) => {
prevNodeCount++;
if (contentIds === key) {
 prevContent = content;
}

if (prevContent) {
  _.forOwn(prevContent, value => {
  const contentvalue: any = this.findElement(value);
  console.log(value);
  if (contentvalue) {
    if ( _.includes(prevContent, contentvalue.contentId)) {
        this.statuscount++;
        if (this.statuscount === prevContent.length) {
          this.statuscount = 0;
          } else if (this.statuscount === 0) {
            node.togglePanelIcon = true;
        }
  }
  } else if (currentRootNodeId === key) {
    node.togglePanelIcon = true;
    this.toasterService.error('please complete prerequisites');
  }
});
}

 });
}
public findElement(content) {
  // console.log(content);
  const foundObject = _.find(this.contentsStatus, (e) => {
    // console.log(e);
    if (e.contentId === content && e.status === 2) {
      console.log(e.contentId, content);
      return content;
    }
  });
  return foundObject;
}
  public onItemSelect(item: any) {
    if (!item.folder) {
      this.contentSelect.emit({ id: item.data.id, title: item.title });
    }
  }

  private initialize() {
    // tslint:disable-next-line:no-debugger
    debugger;
    this.rootNode = this.createTreeModel();
    if (this.rootNode) {
      this.rootChildrens = this.rootNode.children;
      _.forEach(this.rootChildrens, child => {
       if (child.model.prerequisite_Data) {
        child['togglePanelIcon'] = false;
       } else {
        child['togglePanelIcon'] = true;
       }
      });
      this.addNodeMeta();
      _.forOwn(this.rootNode.model.children, children => {
        const obj = {
          id: children.identifier,
          preData: children.prerequisite_Data,
          name: children.name
        };
        this.rootContents[children.identifier] = obj;
        this.getContent(children.identifier, children);
        this.preContent[children.identifier] = this.children;
        this.children = [];

        console.log(this.contentsStatus, this.preContent);
      });
      // _.forOwn(this.preContent, (value, key) => {
      //   console.log(value);
      // _.forOwn(value , contentid => {
      //   const contentValue: any = this.findElement(contentid);
      //   console.log(contentValue, key);
      // });
      //  });
      // console.log(this.contentsStatus, this.preContent);

    }
  }
  getContent(rootId, children) {
    // console.log(this.contentsStatus);
    _.forOwn(children.children, child => {
      if (child.hasOwnProperty('children') && child.children.length > 0) {
        this.getContent(rootId, child);
      } else {
        this.children.push(child.identifier);
      }
    });
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
            this.contentsStatus.push(content);
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
