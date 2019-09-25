import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourceService, ConfigService, ToasterService, ServerResponse, IUserData, IUserProfile, Framework } from '@sunbird/shared';
import { FormService, FrameworkService, UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';
import { Router } from '@angular/router';
import { SpaceEditorService } from '../../services/space-editor/space-editor.service';

@Component({
  selector: 'app-space-default-template',
  templateUrl: './space-default-template.component.html',
  styleUrls: ['./space-default-template.component.scss']
})
export class SpaceDefaultTemplateComponent implements OnInit,  AfterViewInit {
  @Input() formFieldProperties: any;
  @Input() categoryMasterList: any;
  @Input() submited: boolean;
  @Input() org: string;
  /**
    * This variable hepls to show and hide page loader.
    * It is kept true by default as at first when we comes
    * to a page the loader should be displayed before showing
    * any data
    */
  showLoader = true;
  countryList: any;
  langugaes: any;
  key = 'concept';
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
  private contentType;
  /**
 * userForm name creation
 */
  public creationForm: FormGroup;
  /**
* To call resource service which helps to use language constant
*/
  public resourceService: ResourceService;
  /**
* To call resource service which helps to use language constant
*/
  public userService: UserService;
  /**
* userProfile is of type userprofile interface
*/
  public userProfile: IUserProfile;
  /**
* Contains config service reference
*/
  public configService: ConfigService;
  /**
   * frameworkService is get framework data
   */
  public frameworkService: FrameworkService;
  /**
   * formService is to get form meta data
   */
  public formService: FormService;
  /**
   * formInputData is to take input data's from form
   */
  public formInputData = {};
  /**
   * categoryList is category list of dropdown values
   */
  public categoryList: {};
  /**
   * masterList is master copy of framework data
   */
  public masterList: {};
  /**
   * years is used to get years from getYearsForCreateTextBook
   */
  public years: any;
  /**
 * To make content editor service API calls
 */
  private editorService: SpaceEditorService;
  orgname: string;
  flagboard: boolean = false;
  flagdescription: boolean = false;
  flagkeywords: boolean = false;
  flaglanguages: boolean = false;
  flaglink: boolean = false;
  flagname: boolean = false;
  flagregion: boolean = false;
  flagversion: boolean = false;
  flagyear: boolean = false;
  flagcreators : boolean = false;
  constructor(
    formService: FormService,
    private _cacheService: CacheService,
    private router: Router,
    resourceService: ResourceService,
    frameworkService: FrameworkService,
    toasterService: ToasterService,
    userService: UserService,
    configService: ConfigService,
    editorService: SpaceEditorService
  ) {
    this.formService = formService;
    this.resourceService = resourceService;
    this.frameworkService = frameworkService;
    this.toasterService = toasterService;
    this.categoryList = {};
    this.userService = userService;
    this.configService = configService;
    this.editorService = editorService;
  }

  setFormConfig() {
    const DROPDOWN_INPUT_TYPES = ['select', 'multiSelect'];
    _.forEach(this.formFieldProperties, (field) => {
      console.log("here is formfieldprop",this.formFieldProperties);
      if (_.includes(DROPDOWN_INPUT_TYPES, field.inputType)) {
        if (field.depends && field.depends.length) {
          this.getAssociations(this.categoryMasterList[field.code],
            field.range, (associations) => {
              this.applyDependencyRules(field, associations, false);
            });
        }
      }
    });
  }
  ngAfterViewInit() {
    $('#keywords').dropdown({
      allowAdditions: true,
      keys: {
        delimiter: 13
      }
    });
    $('#region').dropdown();
  }
  ngOnInit() {
    /***
 * Call User service to get user data
 */
    this.categoryList['languages'] = this.configService.countryConfig.default.languages;
    this.categoryList['region'] = this.configService.countryConfig.default.countries;

this.countryList = this.configService.countryConfig.default.countries;
this.langugaes = this.configService.countryConfig.default.languages;

console.log('coutry and language list = ', this.configService.countryConfig, this.formFieldProperties);
    this.setFormConfig();
    this.userService.userData$.subscribe(
      (user: IUserData) => {
        console.log('user', user);
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          // this.orgname = user.userProfile.organisations[0].orgName;
          user.userProfile.organisations.forEach(element => {
            console.log('org info', element.locationIds.length);
            if (element.locationIds.length > 0) {
              console.log('if', element.orgName);
              this.formInputData['creators'] =  element.orgName;
            } else {
              console.log('else', element.orgName);
              this.formInputData['creators'] = element.orgName;
            }
          });


          // this.formInputData['creators'] = user.userProfile.organisations[0].orgName;
        }
        //  else if (user && !user.err && user.userProfile.organisationNames.length === 1) {
        //   this.userProfile = user.userProfile;
        //   this.orgname = user.userProfile.organisationNames[0];
        //   this.formInputData['creators'] = user.userProfile.organisationNames[0];
        // }
      });
    this.showLoader = false;
    this.years = this.getYearsForCreateTextBook();
    this.mapMasterCategoryList('');
  }

  /**
* to get selected concepts from concept picker.
*/
  concepts(events) {
    // this.formInputData['concepts'] = events;
    const sector = [];
    _.forEach(events, (field) => {
      sector.push(field.name);
    });
    this.formInputData['gradeLevel'] = sector;

  }

  conceptspFramework(events) {
    // this.formInputData['topic'] = events;
    const spFramework = [];

    _.forEach(events, (field) => {
      spFramework.push(field.name);
    });
    this.formInputData['topic'] = spFramework;
  }

  /**
  * @description            - Which is used to update the form when vlaues is get changes
  * @param {Object} object  - Field information
  */
  updateForm(object) {
    if (object.field.range) {
      this.getAssociations(object.value, object.field.range, (associations) => {
        this.applyDependencyRules(object.field, associations, true);
      });
    }
  }

  /**
* @description                    - Which is used to get the association object by mapping key and range object
* @param {String | Array} keys    - To the associactio object for particular key's
* @param {Object} range           - Which refers to framework terms/range object
*/
  getAssociations(keys, range, callback) {
    let names = [];
    const associations = [];
    const filteredAssociations = [];
    if (_.isString(keys)) {
      names.push(keys);
    } else {
      names = keys;
    }
    _.forEach(range, (res) => {
      _.forEach(names, (value, key) => {
        if (res.name === value) {
          filteredAssociations.push(res);
        }
      });
    });
    _.forEach(filteredAssociations, (val, index) => {
      if (val.associations) {
        _.forEach(val.associations, (key, value) => {
          associations.push(key);
        });
      }
    });
    if (callback) {
      callback(associations);
    }
  }

  /**
* @description                    - Which is used to resolve the dependency.
* @param {Object} field           - Which field need need to get change.
* @param {Object} associations    - Association values of the respective field.
* @param {Boolean} resetSelected  - @default true Which defines while resolving the dependency dropdown
*                                   Should reset the selected values of the field or not
*/
  applyDependencyRules(field, associations, resetSelected) {
    // reset the depended field first
    // Update the depended field with associated value
    // Currently, supported only for the dropdown values
    let dependedValues;
    let groupdFields;
    if (field.depends && field.depends.length) {
      _.forEach(field.depends, (id) => {
        if (resetSelected) {
          this.resetSelectedField(id, field.range);
        }
        dependedValues = _.map(associations, i => _.pick(i, ['name', 'category']));
        groupdFields = _.chain(dependedValues)
          .groupBy('category')
          .map((name, category) => ({ name, category }))
          .value();
        this.updateDropDownList(id, dependedValues);
        if (groupdFields.length) {
          _.forEach(groupdFields, (value, key) => {
            this.updateDropDownList(value.category, _.map(value.name, i => _.pick(i, 'name')));
          });
        } else {
          this.updateDropDownList(id, []);
        }
      });
    }
  }

  /**
   * @description         - Which is used to restore the dropdown slected value.
   * @param {String} id   - To restore the specific dropdown field value
   */
  resetSelectedField(id, field) {
    this.formInputData[id] = '';
  }


  /**
* @description            - Which updates the drop down value list
*                         - If the specified values are empty then drop down will get update with master list
* @param {Object} field   - Field which is need to update.
* @param {Object} values  - Values for the field
*/
  updateDropDownList(fieldCode, values) {
    if (values.length) {
      this.categoryList[fieldCode] = _.unionBy(values, 'name');
    } else {
      this.mapMasterCategoryList(fieldCode);
    }
  }

  /**
*
* @description                     -
* @param {Object} configurations   - Field configurations
* @param {String} key              - Field uniq code
*/
  mapMasterCategoryList(key) {
    _.forEach(this.formFieldProperties, (field, value) => {
      if (key) {
        if (field.code === key) {
          this.categoryList[field.code] = field.range;
        }
      } else {
        if (field.range) {
          this.categoryList[field.code] = field.range;
        }
      }
    });
  }
  /**
   * @method getYearsForCreateTextBook
   */
  getYearsForCreateTextBook() {
    const years = [];
    const currentYear = (new Date()).getUTCFullYear();
    for (let i = currentYear - 15; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  }
  validatingfields(data){
    console.log("data in space default on submit",data);
    if (!!!data.board) {
      this.flagboard = true;
    } else {
      this.flagboard = false;
    }
    if (!!!data.description) {
      this.flagdescription = true;
    } else {
      this.flagdescription = false;
    }
    if (!!!data.keywords || data.keywords.length === 0) {
      this.flagkeywords = true;
    } else {
      this.flagkeywords = false;
    }
    if (!!!data.languages || data.languages.length === 0) {
      this.flaglanguages = true;
    } else {
      this.flaglanguages = false;
    }
    if (!!!data.name) {
      this.flagname = true;
    } else {
      this.flagname = false;
    }
    if (!!!data.region) {
      this.flagregion = true;
    } else {
      this.flagregion = false;
    }
    if (!!!data.version) {
      this.flagversion = true;
    } else {
      this.flagversion = false;
    }
    if (!!!data.year) {
      this.flagyear = true;
    } else {
      this.flagyear = false;
    }
    if (!!!data.creators) {
      this.flagcreators = true;
    } else {
      this.flagcreators = false;
    }
  }
  removingerrorclass(){
    this.flagboard = false;
  this.flagdescription = false;
  this.flagkeywords = false;
  this.flaglanguages = false;
  this.flaglink= false;
  this.flagname = false;
  this.flagregion = false;
  this.flagversion = false;
  this.flagyear= false;
  this.flagcreators=false;
  }
}

