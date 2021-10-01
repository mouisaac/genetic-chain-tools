import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadSpiralsComponent } from './download-spirals/download-spirals.component';

const routes: Routes = [
  { path: '', component: DownloadSpiralsComponent, },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
