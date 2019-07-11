import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-gard.service';
import { MyassestPageComponent } from './components';
import { SpaceDataDrivenComponent } from './components/space-data-driven/space-data-driven.component';

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
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class MyassetsRoutingModule { }