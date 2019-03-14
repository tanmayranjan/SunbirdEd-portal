import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile, Framework,
  ILoaderMessage, NavigationHelperService
} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorService } from './../../services';
import { SearchService, UserService, FrameworkService, FormService , ContentService} from '@sunbird/core';
import * as _ from 'lodash';
import { CacheService } from 'ng2-cache-service';
import { DefaultTemplateComponent } from '../content-creation-default-template/content-creation-default-template.component';
import { IInteractEventInput, IImpressionEventInput } from '@sunbird/telemetry';
import { WorkSpace } from '../../classes/workspace';
import { WorkSpaceService } from '../../services';
import { publish } from 'rxjs/operators';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.scss']
})
export class CreateAssetComponent extends WorkSpace implements OnInit, OnDestroy {
  @ViewChild('formData') formData: DefaultTemplateComponent;
  @ViewChild('modal') modal;

  /**
	 * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
	 */
  showLoader = true;
  /**
* To show toaster(error, success etc) after any API calls
*/
  private toasterService: ToasterService;

  /**
* urlString for get url details
*/
  private urlString;
  /**
* contentType is creation type, fected from url
*/
  public contentType = 'studymaterial';
  /**
   * resourceType is resource type
   */
  public resourceType;
  /**
 * userForm name creation
 */
  public creationForm: FormGroup;
  /**
 * userProfile is of type userprofile interface
 */
  public userProfile: IUserProfile;
  /**
* Contains config service reference
*/
  public configService: ConfigService;
  /**
 * To make inbox API calls
 */
  private editorService: EditorService;
  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;

  public contentService: ContentService;
  /**
 * To call resource service which helps to use language constant
 */
  public userService: UserService;
  /**
 * To send activatedRoute.snapshot to routerNavigationService
 */
  public activatedRoute: ActivatedRoute;
  /**
  * loader message
  */
  loaderMessage: ILoaderMessage;

  public frameworkService: FrameworkService;

  public formService: FormService;

  public formType = 'content';

  public formAction = 'save';

  public getFormFields: any;

  public formFieldProperties: any;

  public categoryMasterList: any;

  public creationFormLable: string;

  public name: string;

  public description: string;

  public isCachedDataExists: boolean;

  public framework: string;

  public contentID: string;

  public formUpdateData: any;
  /**
	* telemetryImpression
	*/
  telemetryImpression: IImpressionEventInput;


  constructor(
    public searchService: SearchService,
    public workSpaceService: WorkSpaceService,
    activatedRoute: ActivatedRoute,
    frameworkService: FrameworkService,
    private router: Router,
    resourceService: ResourceService,
    toasterService: ToasterService,
    editorService: EditorService,
    userService: UserService,
    configService: ConfigService,
    formService: FormService,
    private _cacheService: CacheService,
    public navigationHelperService: NavigationHelperService,
    public contentservice: ContentService
  ) {
    super(searchService, workSpaceService, userService);
    this.activatedRoute = activatedRoute;
    this.resourceService = resourceService;
    this.toasterService = toasterService;
    this.editorService = editorService;
    this.userService = userService;
    this.configService = configService;
    this.frameworkService = frameworkService;
    this.formService = formService;
    this.activatedRoute.url.subscribe(url => {
      // this.contentType = url[0].path;
      console.log('content type', this.contentType, url[0].path);

    });
    console.log('content type', this.contentType);
    this.contentService = contentservice;
    this.resourceType = this.configService.appConfig.resourceType[this.contentType];
    this.creationFormLable = this.configService.appConfig.contentCreateTypeLable[this.contentType];
    this.name = this.configService.appConfig.contentName[this.contentType] ?
                this.configService.appConfig.contentName[this.contentType] : 'Untitled';
   this.description = this.configService.appConfig.contentDescription[this.contentType] ?
   this.configService.appConfig.contentDescription[this.contentType] : 'Untitled';
  }


  ngOnInit() {

console.log('this.activated ', this.activatedRoute.snapshot.params.contentId);
// this.contentID = this.activatedRoute.snapshot.params.contentId;
// this.fetchContentById(this.contentID);

     this.checkForPreviousRouteForRedirect();

    /**
     * fetchFrameworkMetaData is called to config the form data and framework data
     */
    this.fetchFrameworkMetaData();
    /***
 * Call User service to get user data
 */
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
        }
      });
    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
        uri: this.activatedRoute.snapshot.data.telemetry.uri
      }
    };

  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
  /**
  * fetchFrameworkMetaData is gives form config data
  */
  fetchFrameworkMetaData() {
  console.log('hiis');
    this.frameworkService.frameworkData$.subscribe((frameworkData: Framework) => {
      console.log('frame', frameworkData);
      if (!frameworkData.err) {
        console.log('error framework');
        this.categoryMasterList = _.cloneDeep(frameworkData.frameworkdata['defaultFramework'].categories);
        this.framework = frameworkData.frameworkdata['defaultFramework'].code;
        /**
  * isCachedDataExists will check data is exists in cache or not. If exists should not call
  * form api otherwise call form api and get form data
  */
        this.isCachedDataExists = this._cacheService.exists(this.contentType + this.formAction);
        if (this.isCachedDataExists) {
          const data: any | null = this._cacheService.get(this.contentType + this.formAction);
          this.formFieldProperties = data;
        } else {
          const formServiceInputParams = {
            formType: this.formType,
            formAction: this.formAction,
            contentType: this.contentType,
            framework: this.framework
          };
          this.formService.getFormConfig(formServiceInputParams).subscribe(
            (data: ServerResponse) => {
              console.log('data');
              this.formFieldProperties = data;
              this.getFormConfig();
            },
            (err: ServerResponse) => {
              this.toasterService.error(this.resourceService.messages.emsg.m0005);
            }
          );
        }
      } else if (frameworkData && frameworkData.err) {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    });
  }

  /**
   * @description            - Which is used to config the form field vlaues
   * @param {formFieldProperties} formFieldProperties  - Field information
   */
  getFormConfig() {
    _.forEach(this.categoryMasterList, (category) => {
      _.forEach(this.formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.range = category.terms;
        }
        return formFieldCategory;
      });
    });
    this.formFieldProperties = _.sortBy(_.uniqBy(this.formFieldProperties, 'code'), 'index');
    this._cacheService.set(this.contentType + this.formAction, this.formFieldProperties,
      {
        maxAge: this.configService.appConfig.cacheServiceConfig.setTimeInMinutes *
          this.configService.appConfig.cacheServiceConfig.setTimeInSeconds
      });
  }
  /****
* Redirects to workspace create section
*/
  goToCreate() {
    this.router.navigate(['/myassets']);
  }

  /**
* requestBody is returned of type object
*/
  generateData(data) {
    console.log('dat form', data);
    this.showLoader = true;
    const requestData = _.cloneDeep(data);
    requestData.name = data.name ? data.name : this.name,
      requestData.description = data.description ? data.description : this.description,
      requestData.createdBy = this.userProfile.id,
      requestData.organisation = this.userProfile.organisationNames,
      requestData.createdFor = this.userProfile.organisationIds,
      requestData.contentType = this.configService.appConfig.contentCreateTypeForEditors[this.contentType],
      requestData.framework = this.framework;
      requestData.version = Number(requestData.version);
      delete requestData.status;
    if (this.contentType === 'studymaterial') {
      requestData.mimeType = 'text/x-url';
    } else {
      requestData.mimeType = this.configService.urlConFig.URLS.CONTENT_COLLECTION;
    }
    if (this.resourceType) {
      requestData.resourceType = this.resourceType;
    }
    if (!_.isEmpty(this.userProfile.lastName)) {
      requestData.creator = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    } else {
      requestData.creator = this.userProfile.firstName;
    }
    return requestData;
  }

  updateContent() {
    console.log('in update content', this.generateData(_.pickBy(this.formData.formInputData)));
    const requestData = {
      content: this.generateData(_.pickBy(this.formData.formInputData)),
      // url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.activatedRoute.snapshot.params.contentId}`,

    };
    console.log('form data', this.formData.formInputData , requestData);

    // this.contentService.patch(requestData).subscribe(data =>{
    //   console.log('read content', data)
    //   this.formUpdateData = data.result.content;
    //   console.log(this.formUpdateData);
    // }, err =>{
    //   this.toasterService.error(this.resourceService.messages.fmsg.m0078);

    // });

    this.editorService.update(requestData, this.activatedRoute.snapshot.params.contentId).subscribe(res => {
        console.log('res', res);
        this.toasterService.error('Asset updated Successfully');
        this.goToCreate();
    }, err => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0078);

    });


  //   if (this.contentType === 'studymaterial') {
  //     this.editorService.create(requestData).subscribe(res => {
  //       console.log('res', res);
  //       this.createLockAndNavigateToEditor({identifier: res.result.content_id});
  //     }, err => {
  //       this.toasterService.error(this.resourceService.messages.fmsg.m0078);
  //     });
  //   } else {
  //     this.editorService.create(requestData).subscribe(res => {
  //       this.createLockAndNavigateToEditor({identifier: res.result.content_id});
  //     }, err => {
  //       this.toasterService.error(this.resourceService.messages.fmsg.m0010);
  //     });
  //   }
  //   this.sendForReview();
  //  }
  }

  createLockAndNavigateToEditor (content) {
    const state = 'draft';
    const framework = this.framework;
    // if (this.contentType === 'studymaterial') {
    //   this.router.navigate(['/workspace/content/edit/content/', content.identifier, state, framework, 'Draft']);
    // } else {
    //   const type = this.configService.appConfig.contentCreateTypeForEditors[this.contentType];
    //   this.router.navigate(['/workspace/content/edit/collection', content.identifier, type, state, framework, 'Draft']);
    // }
  }

  /**
    * Issue #SB-1448,  If previous url is not from create page, redirect current page to 'workspace/content/create'
  */
  checkForPreviousRouteForRedirect() {
    const previousUrlObj = this.navigationHelperService.getPreviousUrl();
    console.log('pre', previousUrlObj);
    if (previousUrlObj && previousUrlObj.url && (previousUrlObj.url !== '/myassets')) {
      this.redirect();
    }
  }

  sendForReview () {

  }
  fetchContentById(id) {
    console.log('hii iam');

  }
  redirect() {
    this.router.navigate(['/myassets']);

  }
}