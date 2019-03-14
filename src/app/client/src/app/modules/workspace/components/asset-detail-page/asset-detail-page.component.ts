import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import { BadgesService } from '../../../core/services/badges/badges.service';
@Component({
  selector: 'app-asset-detail-page',
  templateUrl: './asset-detail-page.component.html',
  styleUrls: ['./asset-detail-page.component.scss']
})
export class AssetDetailPageComponent implements OnInit {
  badgeList: any;
  success = false;
  public activatedRoute: ActivatedRoute;
  public configService: ConfigService;
  public contentService: ContentService;
  badgeService: BadgesService;
  public contentId;
  public route: Router;
  public assetDetail = {};
  constructor(activated: ActivatedRoute,
    badgeService: BadgesService,
    config: ConfigService, contentServe: ContentService , rout: Router) {
    this.activatedRoute = activated;
    this.activatedRoute.url.subscribe(url => {
      this.contentId = url[1].path;
    });
    this.configService = config;
    this.contentService = contentServe;
    this.badgeService = badgeService;
    this.route = rout;
   }

  ngOnInit() {
    console.log('content', this.contentId);
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${this.activatedRoute.snapshot.params.contentId}`,
    };
    this.contentService.get(req).subscribe(data => {
      console.log('read content', data);
      this.assetDetail = data.result.content;
    });
    console.log('this', this.assetDetail);

    const request = {
      request: {
        filters: {
          issuerList: [],
          rootOrgId: '0127121193133670400',
          roles: ['TEACHER_BADGE_ISSUER'],
          type: 'content'
        }
      }
    };
    this.badgeService.getAllBadgeList(request).subscribe((data) => {
      console.log('data for badge', data);
      this.badgeList = data.result.badges;
    });
  }
  assignBadge(issuerId, badgeId) {
    console.log('ids', issuerId, badgeId);
    this.success = true ;
    const req = {
      request: {
        recipientId: this.contentId,
        recipientType: 'content',
        issuerId: issuerId,
        badgeId: badgeId
      }

    };
    this.badgeService.createAssertion(req).subscribe((data) => {
      console.log('aser', data);
    });
   this.callAlert();
  }
  callAlert() {
    alert('Badge added Successfully');
  }
  navigateToDetailsPage() {
    this.route.navigate(['myassets']);
  }
}
