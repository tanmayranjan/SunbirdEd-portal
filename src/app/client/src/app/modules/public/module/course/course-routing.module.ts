import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent, ExploreCourseComponent , CatalogComponent } from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';
// import { CatalogComponent } from 'src/app/modules/search/components/catalog/catalog.component';
const routes: Routes = [
  {
    path: '', component: CourseComponent, data: {
      telemetry: {
        env: 'explore', pageid: 'explore-course', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'explore', pageid: 'explore-view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore-course',
      frameworkName: true,
      formAction: 'filter'
    }
  },
    // {
    //   path: ':pageNumber', component: ExploreCourseComponent, data: {
    //     telemetry: {
    //       env: 'explore', pageid: 'explore-course-search', type: 'view', subtype: 'paginate'
    //     }
    //   }
    // }
    {
      path: ':pageNumber', component: CatalogComponent , data: {
        telemetry: {
          env: 'explore', pageid: 'explore-course', type: 'view', subtype: 'paginate'
        },
        orgdata: {
          rootOrgId: '0127053482034872320',
          defaultFramework : 'niit_tv'
        }
      }
    },


  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CourseRoutingModule { }
