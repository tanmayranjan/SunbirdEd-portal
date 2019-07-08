import { Component, OnInit } from '@angular/core';
import { ConfigService, ServerResponse, ToasterService, IUserData } from '@sunbird/shared';
import { PublicDataService, UserService, LearnerService } from '@sunbird/core';
import { ConfigureService } from '../../services/configure/configure.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  alert = false;
  public userServie: UserService;
  user: any;
  country: any;
  registerForm: FormGroup;
  submitted = false;
  constructor(public configService: ConfigService, public publicDataService: PublicDataService,
    public dataService: ConfigureService, public tosterservice: ToasterService, public router: Router,
    userService: UserService, public learnSerive: LearnerService, private formBuilder: FormBuilder) {
    this.userServie = userService;
  }
  email: any;
  name: any;
  org: any;
  message: any;
  userData: any;
  userName: any;
  userEmail: any;
  orgName: any;
  loading: any;
  // contactform = document.getElementById('contactform');
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;

  ngOnInit() {

    this.userServie.userData$.subscribe(
      (user: IUserData) => {
        this.user = user.userProfile;
        this.userName = this.user.firstName;
        this.userEmail = this.user.email;
        this.orgName = this.user.rootOrg.orgName;
      });
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      org: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.name = this.registerForm.value.userName;
    this.email = this.registerForm.value.email;
    this.org = this.registerForm.value.org;
    this.message = this.registerForm.value.message;
    this.country = this.registerForm.value.country;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.sendNotification();

  }
  sendNotification() {
    this.userData = 'Name: ' + this.name + '<br>' + 'Email Id: ' + this.email + '<br>' +
      'Organization Name: ' + this.org + '<br>' + 'Country: ' + this.country + '<br>' + 'Message: ' + this.message;
    const body = {
      request: {

        subject: this.dataService.dataConfig.default.contactsubject,

        body: this.dataService.dataConfig.default.body + '<br>' + this.userData,

        orgImgUrl: this.dataService.dataConfig.default.orgImgUrl,

        emailTemplateType: this.dataService.dataConfig.default.contacttemplate,

        fromEmail: this.dataService.dataConfig.default.fromEmail,

        recipientEmails: this.dataService.dataConfig.default.email

      }
    };
console.log('req body for contact form = ', body, this.dataService.dataConfig.default);
    const req = {
      url: `${this.configService.urlConFig.URLS.FEEDBACK.EMAIL}`,
      data: body
    };
    this.learnSerive.post(req).subscribe((data: ServerResponse) => {
      this.alert = !this.alert;
      this.tosterservice.success('Thanks for Contacting Us. We will get back to you very soon.');
      return data;
    });


  }


}
