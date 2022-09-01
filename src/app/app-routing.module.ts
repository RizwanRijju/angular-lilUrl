import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlShortenerComponent } from './url-shortener/url-shortener.component';

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
