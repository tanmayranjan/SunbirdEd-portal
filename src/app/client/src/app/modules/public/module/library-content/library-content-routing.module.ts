import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LibraryComponent, ExploreLibraryComponent} from './components';
import {ViewAllComponent} from '@sunbird/shared-feature';


const routes: Routes = [
  {
    path: '', component: LibraryComponent, data: {
      telemetry: {
        env: 'explore', pageid: 'explore', type: 'view', subtype: 'paginate'
      },
      softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 }
    }
  },
  {
    path: '', redirectTo: '1'
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      telemetry: {
        env: 'explore', pageid: 'view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'explore',
      softConstraints: {badgeAssertions: 98, board: 99, channel: 100},
      applyMode: true
    }
  },
    {
      path: ':pageNumber', component: ExploreLibraryComponent, data: {
        telemetry: {
          env: 'explore', pageid: 'explore-search', type: 'view', subtype: 'paginate'
        },
        softConstraints: { badgeAssertions: 98, board: 99,  channel: 100 }
      }
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryContentRoutingModule { }
