import { NgModule } from '@angular/core';
import { MatFormFieldModule, 
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatSlideToggle,
        MatProgressSpinnerModule
         } from '@angular/material'

@NgModule({
  declarations: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ]
})
export class CustomMaterialModule { }
