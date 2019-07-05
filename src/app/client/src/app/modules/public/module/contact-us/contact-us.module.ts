import { NgModule } from '@angular/core';
import { ContactUsComponent } from './components';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [ContactUsComponent],
})
export class ContactUsModule { }
