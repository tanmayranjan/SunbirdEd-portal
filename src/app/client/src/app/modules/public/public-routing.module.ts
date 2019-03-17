import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import {
  LandingPageComponent, PublicContentPlayerComponent,
  PublicCollectionPlayerComponent
} from './components';
import { LandingpageGuard } from './services';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CommonLicenseComponent } from './components/common-license/common-license.component';
import { PeopleInvlovedComponent } from './components/people-invloved/people-invloved.component';
import { AboutUSComponent } from './components/about-us/about-us.component';
import { BlogComponent } from './components/blog/blog.component';
import { ExploreAssetComponent } from './components/explore-asset/explore-asset.component';
import { CoreComponent } from './components/core/core.component';
import { ExploreThinkingComponent } from './components/explore-thinking/explore-thinking.component';
import { FrameworkComponent } from './components/framework/framework.component';

const routes: Routes = [
  {
    path: '', // root path '/' for the app
    component: LandingPageComponent,
    canActivate: [LandingpageGuard],
    data: {
      telemetry: {
        env: 'public', pageid: 'landing-page', type: 'edit', subtype: 'paginate'
      }
    }
  },
  {
    path: 'get', component: GetComponent, data: {
      telemetry: {
        env: 'public', pageid: 'get', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'get/dial/:dialCode', component: DialCodeComponent, data: {
      telemetry: {
        env: 'public', pageid: 'get-dial', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'play/content/:contentId', component: PublicContentPlayerComponent, data: {
      telemetry: {
        env: 'public', pageid: 'play-content', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'play/collection/:collectionId', component: PublicCollectionPlayerComponent, data: {
      telemetry: {
        env: 'public', pageid: 'play-collection', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'explore', loadChildren: './module/explore/explore.module#ExploreModule'
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
    path: ':slug/signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: 'signup', loadChildren: './module/signup/signup.module#SignupModule'
  },
  {
    path: 'contactUs', component: ContactUsComponent
  },
  {
    path: 'license', component: CommonLicenseComponent
  },
  {
    path: 'people', component: PeopleInvlovedComponent
  },
  {
    path: 'aboutUs', component: AboutUSComponent
  },
  {
    path: 'blog', component: BlogComponent
  },
  {
    path: 'exploreAsset', component: ExploreAssetComponent
  },
  {
    path: 'core', component: CoreComponent
  },
  {
    path: 'exploreThinking', component: ExploreThinkingComponent
  }
  , {
    path: 'framework', component: FrameworkComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
