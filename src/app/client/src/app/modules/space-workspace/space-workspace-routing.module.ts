import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { OrganizationUploadComponent, UserUploadComponent, StatusComponent } from '../org-management';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ViewuserComponent } from './components/viewuser/viewuser.component';

const routes: Routes = [
    {
        path: '', component: WorkspaceComponent,
    // },
        children: [
          {
            path: 'addUser', component: AdduserComponent,
            data: {
              redirectUrl: 'Workspace/addUser'
            }
          },
          {
            path: 'addOrganisation/:pageNumber', component: OrganizationUploadComponent,
            data: {
              redirectUrl: 'Workspace/addUser'
            }
          },
          {
            path: 'addMultipleUsers/:pageNumber', component: UserUploadComponent,
            data: {
              redirectUrl: 'Workspace/addUser'
            }
          },
          {
            path: 'checkUploadStatus/:pageNumber', component: StatusComponent,
            data: {
              redirectUrl: 'Workspace/addUser'
            }
          }, {
            path: 'viewuser', component: ViewuserComponent,
            data: {
              redirectUrl: 'Workspace/addUser'
            }
            , children : [
        {
            path: 'edit/:userId', component: UserEditComponent, data: {
              telemetry: {
                env: 'profile', pageid: 'user-edit', type: 'edit', subtype: 'paginate'
              }
            }
          },
            ]
          },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SapceWorkspaceRoutingModule { }
