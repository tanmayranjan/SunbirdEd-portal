import { NgModule } from '@angular/core';
import { ViewuserComponent } from './components/viewuser/viewuser.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { CoreModule } from '@sunbird/core';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgManagementModule } from '../org-management';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SapceWorkspaceRoutingModule } from './space-workspace-routing.module';
import { UserSearchServicePublicService } from './services/searchservices/user-search-service-public.service';

@NgModule({
    imports: [
        CoreModule,
        NgInviewModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        OrgManagementModule,
        CommonModule,
        // BrowserModule,
        RouterModule,
        SapceWorkspaceRoutingModule
    ],
    declarations: [
      ViewuserComponent, UserEditComponent,
       AdduserComponent, WorkspaceComponent
      ],
    providers: [ UserSearchServicePublicService]
  })
  export class SpaceWorkspaceModule { }

