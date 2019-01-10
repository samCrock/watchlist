import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
  { path: 'detail', component: DetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
