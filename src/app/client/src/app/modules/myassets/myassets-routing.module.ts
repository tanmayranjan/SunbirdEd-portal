import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-gard.service';
import { MyassestPageComponent, AssetDetailPageComponent, CreateAssetComponent, PdfViewerComponent, EditorComponent } from './components';
import { SpaceDataDrivenComponent } from './components/space-data-driven/space-data-driven.component';
import { GenericEditorComponent } from '../workspace';

const routes: Routes = [
    {
        path: '', component: MyassestPageComponent, canActivate: [AuthGuard], data: { roles: 'workspace' },
        // children: [
        //     {
        //         path: 'create', component: SpaceDataDrivenComponent, canActivate: [AuthGuard],
        //         data: {
        //           breadcrumbs: [{ label: 'Home', url: '/home' },
        //           { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }],
        //           roles: 'workspace'
        //         }
        //       }
        // ]
    },
    {
      path: 'create', component: SpaceDataDrivenComponent, canActivate: [AuthGuard],
      data: {
        breadcrumbs: [{ label: 'Home', url: '/home' },
        { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }],
        roles: 'workspace'
      }
    },
    {
      path: 'review/detail/:contentId', component: AssetDetailPageComponent
    },
    {
      path: 'edit/generic', component: EditorComponent,
      canActivate: [AuthGuard], data: { roles: 'workspace' }
    },
    {
      path: 'edit/generic/:contentId/:state/:contentStatus', component: EditorComponent,
      canActivate: [AuthGuard], data: { roles: 'workspace' }
    },
    {
      path: 'update/:contentId/:status', component: CreateAssetComponent,
      data: {
        roles: 'workspace'
      }
    },
    {
      path: 'update/:contentId/:status/play', component: PdfViewerComponent,
      data: {
        roles: 'workspace'
      }
    },
    {
      path: 'detail/:contentId/:status', component: AssetDetailPageComponent
    },
    {
      path: 'play/:contentId/:status', component: PdfViewerComponent, canActivate: [AuthGuard],
      data: {
        roles: 'workspace'
      }
    }

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MyassetsRoutingModule { }
