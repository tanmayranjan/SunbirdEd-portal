import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-gard.service';
import { MyassestPageComponent, AssetDetailPageComponent, CreateAssetComponent, PdfViewerComponent } from './components';
import { SpaceDataDrivenComponent } from './components/space-data-driven/space-data-driven.component';
import { GenericEditorComponent } from '../workspace';

const routes: Routes = [
    {
        path: '', component: MyassestPageComponent, canActivate: [AuthGuard], data: { roles: 'workspace' },
        children: [
            {
                path: 'create', component: SpaceDataDrivenComponent, canActivate: [AuthGuard],
                data: {
                  breadcrumbs: [{ label: 'Home', url: '/home' },
                  { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }],
                  roles: 'workspace'
                }
              },
              {
                path: 'edit/generic', component: GenericEditorComponent,
                canActivate: [AuthGuard], data: { roles: 'workspace' }
              },
        ]
    },
    {
      path: 'review/detail/:contentId', component: AssetDetailPageComponent
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
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MyassetsRoutingModule { }