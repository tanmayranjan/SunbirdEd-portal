import { Component, OnInit, NgZone } from '@angular/core';
import { IUserProfile, NavigationHelperService, ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { UserService, AssetService, TenantService, FrameworkService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import {  MyassetsService } from '../../services';
import { first, tap, delay, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { combineLatest, of, throwError } from 'rxjs';
import { environment } from '@sunbird/environment';

@Component({
  selector: 'app-asset-editor',
  templateUrl: './asset-editor.component.html',
  styleUrls: ['./asset-editor.component.scss']
})
export class AssetEditorComponent implements OnInit {

  private userProfile: IUserProfile;
  private routeParams: any;
  private buildNumber: string;
  private deviceId: string;
  private portalVersion: string;
  public logo: string;
  public showLoader = true;
  private browserBackEventSub;
  public extContWhitelistedDomains: string;
  public ownershipType: Array<string>;
  public queryParams: object;
  public contentDetails: any;
  public videoMaxSize: any;
  constructor(private userService: UserService,private assetService: AssetService,
    public _zone: NgZone, private activatedRoute: ActivatedRoute,
   private tenantService: TenantService, private telemetryService: TelemetryService, private router: Router,
   private navigationHelperService: NavigationHelperService, public workspaceService: MyassetsService,
   private configService: ConfigService, private toasterService: ToasterService,
   private resourceService: ResourceService, private frameworkService: FrameworkService) {
   const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
   this.buildNumber = buildNumber ? buildNumber.value : '1.0';
   const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
   this.deviceId = deviceId ? deviceId.value : '';
   this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
   this.extContWhitelistedDomains = (<HTMLInputElement>document.getElementById('extContWhitelistedDomains')) ?
     (<HTMLInputElement>document.getElementById('extContWhitelistedDomains')).value : 'youtube.com,youtu.be';
   this.videoMaxSize = (<HTMLInputElement>document.getElementById('videoMaxSize')) ?
     (<HTMLInputElement>document.getElementById('videoMaxSize')).value : '100';
 }
 ngOnInit() {
   this.userProfile = this.userService.userProfile;
   this.routeParams = this.activatedRoute.snapshot.params;
   this.queryParams = this.activatedRoute.snapshot.queryParams;
   this.disableBrowserBackButton();
   this.getDetails().pipe(first(),
     tap(data => {
       if (data.tenantDetails) {
         this.logo = data.tenantDetails.logo;
       }
       this.showLoader = false;
       this.initEditor();
       this.setWindowContext();
       this.setWindowConfig();
     }),
     delay(10)) // wait for iziModal lo load
     .subscribe((data) => {
       jQuery('#assetEditor').iziModal('open');
     },
       (error) => {
         if (error === 'NO_PERMISSION') {
           this.toasterService.error(this.resourceService.messages.emsg.m0013);
         } else if (['RESOURCE_SELF_LOCKED', 'RESOURCE_LOCKED'].includes(_.get(error, 'error.params.err'))) {
           this.toasterService.error(_.replace(error.error.params.errmsg, 'resource', 'content'));
         } else {
           this.toasterService.error(this.resourceService.messages.emsg.m0004);
         }
         this.closeModal();
       }
     );
 }
 private getDetails() {
   // const lockInfo = _.pick(this.queryParams, 'lockKey', 'expiresAt', 'expiresIn');
   // const allowedEditState = ['draft', 'allcontent', 'collaborating-on', 'uploaded'].includes(this.routeParams.state);
   // const allowedEditStatus = this.routeParams.contentStatus ? ['draft'].includes(this.routeParams.contentStatus.toLowerCase()) : false;
   // if (_.isEmpty(lockInfo) && allowedEditState && allowedEditStatus) {
     return combineLatest(this.tenantService.tenantData$, this.getAssetDetails()).
     pipe(map(data => ({ tenantDetails: data[0]['tenantData'],
       collectionDetails: data[1] })));
 }
 private getAssetDetails() {
   if (this.routeParams.contentId) {
   return this.assetService.get(this.routeParams.contentId).
     pipe(map((data) => {
       if (data) {
         this.contentDetails = data.result.asset;
         return of(data);
       } else  {
         return throwError(data);
       }
     }));
   } else {
     return of({});
   }
 }
 private initEditor() {
   jQuery('#assetEditor').iziModal({
     title: '',
     iframe: true,
     iframeURL: '/thirdparty/editors/asset-editor/index.html?' + this.buildNumber,
     navigateArrows: false,
     fullscreen: true,
     openFullscreen: true,
     closeOnEscape: true,
     overlayClose: false,
     overlay: false,
     overlayColor: '',
     history: false,
     closeButton: true,
     onClosing: () => {
       this._zone.run(() => {
         this.closeModal();
       });
     }
   });
 }
 private setWindowContext() {
   window.context = {
     user: {
       id: this.userService.userid,
       name : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.firstName + ' ' + this.userProfile.lastName :
       this.userProfile.firstName,
       orgIds: this.userProfile.organisationIds,
       organisations: this.userService.orgIdNameMap
     },
     did: this.deviceId,
     sid: this.userService.sessionId,
     contentId: this.routeParams.contentId,
     pdata: {
       id: this.userService.appId,
       ver: this.portalVersion,
       pid: 'sunbird-portal'
     },
     contextRollUp: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
     tags: this.userService.dims,
     channel: this.userService.channel,
     defaultLicense: this.frameworkService.getDefaultLicense(),
     env: 'generic-editor',
     framework: this.routeParams.framework,
     ownershipType: this.ownershipType,
     timeDiff: this.userService.getServerTimeDiff
   };
 }
 private setWindowConfig() {
   window.config = _.cloneDeep(this.configService.editorConfig.GENERIC_EDITOR.WINDOW_CONFIG); // cloneDeep to preserve default config
   window.config.build_number = this.buildNumber;
   window.config.headerLogo = this.logo;
   window.config.lock = _.pick(this.queryParams, 'lockKey', 'expiresAt', 'expiresIn');
   window.config.extContWhitelistedDomains = this.extContWhitelistedDomains;
   window.config.enableTelemetryValidation = environment.enableTelemetryValidation; // telemetry validation
   window.config.videoMaxSize = this.videoMaxSize;
 }
 /**
 * Re directed to the workspace on close of modal
 */
 closeModal() {
   this.showLoader = true;
   if (document.getElementById('assetEditor')) {
     document.getElementById('assetEditor').remove();
   }
   const isContentStatus = _.get(this.routeParams, 'contentStatus');
   if ((isContentStatus && isContentStatus.toLowerCase() === 'draft') ||
 (window.context && window.context.contentId && !isContentStatus)) {
   //  this.retireLock();
   } else {
     this.redirectToWorkSpace();
   }
 }

 redirectToWorkSpace () {
  this.toasterService.success('Asset created successfully');
 setTimeout(() => {
  this.navigationHelperService.navigateToWorkSpace('/myassets');
 }, 1700);
}

 private disableBrowserBackButton() {
   sessionStorage.setItem('inEditor', 'true');
   window.location.hash = 'no';
   this.workspaceService.toggleWarning(this.routeParams.type);
   this.browserBackEventSub = this.workspaceService.browserBackEvent.subscribe(() => {
     const closeEditorIntractEdata: IInteractEventEdata = {
       id: 'browser-back-button',
       type: 'click',
       pageid: 'generic-editor'
     };
     this.generateInteractEvent(closeEditorIntractEdata);
   });
 }
 private generateInteractEvent(intractEdata) {
   if (intractEdata) {
     const appTelemetryInteractData: any = {
       context: {
         env: 'generic-editor'
       },
       edata: intractEdata
     };
     if (this.routeParams.contentId) {
       appTelemetryInteractData.object = {
         id: this.routeParams.contentId,
         type: 'content',
         ver: '1.0'
       };
     }
     this.telemetryService.interact(appTelemetryInteractData);
   }
 }
 ngOnDestroy() {
   if (document.getElementById('assetEditor')) {
     document.getElementById('assetEditor').remove();
   }
   if (this.browserBackEventSub) {
     this.browserBackEventSub.unsubscribe();
   }
   sessionStorage.setItem('inEditor', 'false');
   this.workspaceService.toggleWarning();
   const removeIzi = document.querySelector('.iziModal-isAttached');
   if (removeIzi) {
     removeIzi.classList.remove('iziModal-isAttached');
   }
 }
}
