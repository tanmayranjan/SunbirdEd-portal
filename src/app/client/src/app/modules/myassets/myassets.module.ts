import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { MyassestPageComponent } from './components/myassest-page/myassest-page.component';
import { CreateAssetComponent } from './components/create-asset/create-asset.component';
import { AssetDetailPageComponent } from './components/asset-detail-page/asset-detail-page.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { UpdateResoureFormComponent } from './components/update-resoure-form/update-resoure-form.component';
import { PlayerHelperModule } from '../player-helper';
import { OrderModule } from 'ngx-order-pipe';
import { TelemetryModule } from '../telemetry';
import { NgInviewModule } from 'angular-inport';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '../shared';
import { SlickModule } from 'ngx-slick';
import { MyassetsRoutingModule } from './myassets-routing.module';
// import { GenericEditorComponent } from '../workspace';
import { MyassetsService, SpaceEditorService } from './services';
import { ContentFilterComponent } from './components/content-filter/content-filter.component';
import { SpaceDataDrivenComponent } from './components/space-data-driven/space-data-driven.component';
import { SpaceDefaultTemplateComponent } from './components/space-default-template/space-default-template.component';
import { EditorComponent } from './components/editor/editor.component';

@NgModule({
    imports: [
      CoreModule,
      CommonModule,
      SlickModule,
      MyassetsRoutingModule,
      SharedModule,
      SuiModule,
      FormsModule,
      CoreModule,
      ReactiveFormsModule,
      NgInviewModule,
      TelemetryModule,
      OrderModule,
      PlayerHelperModule
    ],
    declarations: [
      MyassestPageComponent,
      CreateAssetComponent,
      AssetDetailPageComponent,
      PdfViewerComponent,
      UpdateResoureFormComponent,
      // AllMyContentFilterComponent,
      ContentFilterComponent,
      SpaceDataDrivenComponent,
      SpaceDefaultTemplateComponent,
      // GenericEditorComponent,
      EditorComponent

    ],
    providers: [MyassetsService, SpaceEditorService],
    exports: [ CreateAssetComponent, MyassestPageComponent]
  })

export class MyassetsModule { }
