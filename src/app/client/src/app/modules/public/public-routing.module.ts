import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './components';
import { LandingpageGuard } from './services';
import { CommonLicenseComponent } from './components/common-license/common-license.component';
import { PeopleInvlovedComponent } from './components/people-invloved/people-invloved.component';
import { AboutUSComponent } from './components/about-us/about-us.component';
import { BlogComponent } from './components/blog/blog.component';
import { ExploreAssetComponent } from './components/explore-asset/explore-asset.component';
import { CoreComponent } from './components/core/core.component';
import { ExploreThinkingComponent } from './components/explore-thinking/explore-thinking.component';
import { FrameworkComponent } from './components/framework/framework.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
// import { WorkspaceComponent } from './components/workspace/workspace.component';
// import { AdduserComponent } from './components/adduser/adduser.component';
import { OrganizationUploadComponent, UserUploadComponent, StatusComponent } from '../org-management';
// import { ViewuserComponent } from './components/viewuser/viewuser.component';
import { UserEditComponent } from '../search';
import { AboutSunbirdComponent } from './components/about-sunbird/about-sunbird.component';
import { PartnersSunbirdComponent } from './components/partners-sunbird/partners-sunbird.component';
import { OfflineApplicationDownloadComponent } from '@sunbird/shared';

const routes: Routes = [
  {
    path: '', component: LandingPageComponent, canActivate: [LandingpageGuard],
    data: { telemetry: { env: 'public', pageid: 'landing-page', type: 'edit', subtype: 'paginate' } }
  },
  {
    path: 'explore', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: 'explore-assets', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: ':slug/explore-assets', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: 'explore-library', loadChildren: './module/library-content/library-content.module#LibraryContentModule'
  },
  {
    path: ':slug/explore-library', loadChildren: './module/library-content/library-content.module#LibraryContentModule'

  },
  {
    path: ':slug/about-sunbird', component: AboutSunbirdComponent
  },
  {
    path: ':slug/partners-sunbird', component: PartnersSunbirdComponent
  },
  {
    path: ':slug/contactUs' , component: ContactUsComponent
  },
  {
    path: 'contactUs' , component: ContactUsComponent
  },
  {
    path: ':slug/about', component: AboutUSComponent
  },
  {
    path: 'about', component: AboutUSComponent
  },
  {
    path: ':slug/collaborators', component: PeopleInvlovedComponent
  },
  {
    path: 'collaborators', component: PeopleInvlovedComponent
  },
  {
    path: ':slug/explore', loadChildren: './module/explore/explore.module#ExploreModule'
  },
  {
    path: 'explore-course', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: ':slug/explore-course', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: 'explore-courses', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: ':slug/explore-courses', loadChildren: './module/course/course.module#CourseModule'
  },
  {
    path: ':slug/signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: 'signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: ':slug/sign-in/sso', loadChildren: './module/sign-in/sso/sso.module#SsoModule'
  },
  {
    path: 'sign-in/sso', loadChildren: './module/sign-in/sso/sso.module#SsoModule'
  },

  {
    path: 'process', component: CommonLicenseComponent
  },
  {
    path: ':slug/process', component: CommonLicenseComponent
  },
  {
    path: 'policy', component: BlogComponent
  },
  {
    path: ':slug/policy', component: BlogComponent
  },
  {
    path: 'exploreAsset', component: ExploreAssetComponent
  },
  {
    path: ':slug/core', component: CoreComponent
  },
  {
    path: 'termsOfUse', component: ExploreThinkingComponent
  },
  {
    path: ':slug/termsOfUse', component: ExploreThinkingComponent
  }
  , {
    path: ':slug/framework', component: FrameworkComponent
  },
  {
    path: 'play', loadChildren: './module/player/player.module#PlayerModule'
  },
  {
   path: ':slug/download/offlineapp', component: OfflineApplicationDownloadComponent
  },
  {
   path: 'download/offlineapp', component: OfflineApplicationDownloadComponent
   }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
