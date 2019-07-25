import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material-module/custom-material-module.module'
import { QuillModule } from 'ngx-quill'
import { CookieService } from 'ngx-cookie-service'

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupSplitComponent } from './signup-split/signup-split.component';
import { RegisterEmployerComponent } from './register-employer/register-employer.component';
import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { JobPostComponent } from './job-post/job-post.component';
import { JobAdComponent } from './job-ad/job-ad.component';
import { CreateJobPostComponent } from './create-job-post/create-job-post.component';
import { EmployerNavbarComponent } from './employer-navbar/employer-navbar.component';
import { EmployerComponent } from './employer/employer.component';
import { GeneralComponent } from './general/general.component';
import { EmployerJobBoardComponent } from './employer-job-board/employer-job-board.component';
import { CompanyComponent } from './company/company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { EditJobPostComponent } from './edit-job-post/edit-job-post.component';
import { SeekerJobBoardComponent } from './seeker-job-board/seeker-job-board.component';
import { SeekerNavbarComponent } from './seeker-navbar/seeker-navbar.component';
import { SeekerComponent } from './seeker/seeker.component';
import { DialogComponent } from './dialog/dialog.component';
import { EmployerJobPostComponent } from './employer-job-post/employer-job-post.component';
import { SeekerJobPostComponent } from './seeker-job-post/seeker-job-post.component';
import { SeekerApplicationsComponent } from './seeker-applications/seeker-applications.component';
import { EmployerApplicationsComponent } from './employer-applications/employer-applications.component';
import { SeekerAppItemComponent } from './seeker-app-item/seeker-app-item.component';
import { EmployerAppItemComponent } from './employer-app-item/employer-app-item.component';
import { EmployerEditProfileComponent } from './employer-edit-profile/employer-edit-profile.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
// import { contactValidator } from './shared/contact-validator.directive';
import { EstablishmentValidatorDirective } from './shared/establishment-validator.directive';
import { EditEmployerComponent } from './edit-employer/edit-employer.component';
import { EditSeekerComponent } from './edit-seeker/edit-seeker.component';
import { EditSeekerProfileComponent } from './edit-seeker-profile/edit-seeker-profile.component';
import { SeekerProfileComponent } from './seeker-profile/seeker-profile.component';
import { DuplicateValidatorDirective } from './shared/duplicate-validator.directive';
import { SeekerRecommendedComponent } from './seeker-recommended/seeker-recommended.component';
import { SeekerRecommendedAdComponent } from './seeker-recommended-ad/seeker-recommended-ad.component';
import { ProfileComponent } from './profile/profile.component';
import { OptionsService } from './options.service';
import { EditJobPostService } from './edit-job-post.service';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { ChoiceModalComponent } from './choice-modal/choice-modal.component';
import { LoadingComponent } from './loading/loading.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    IndexComponent,
    LoginComponent,
    NavbarComponent,
    SignupSplitComponent,
    RegisterEmployerComponent,
    EmployerDashboardComponent,
    JobBoardComponent,
    JobPostComponent,
    JobAdComponent,
    CreateJobPostComponent,
    EmployerNavbarComponent,
    EmployerComponent,
    GeneralComponent,
    EmployerJobBoardComponent,
    CompanyComponent,
    EditCompanyComponent,
    EditJobPostComponent,
    SeekerJobBoardComponent,
    SeekerNavbarComponent,
    SeekerComponent,
    DialogComponent,
    EmployerJobPostComponent,
    SeekerJobPostComponent,
    SeekerApplicationsComponent,
    EmployerApplicationsComponent,
    SeekerAppItemComponent,
    EmployerAppItemComponent,
    EmployerEditProfileComponent,
    ErrorPageComponent,
    CompanyProfileComponent,
    EstablishmentValidatorDirective,
    EditEmployerComponent,
    EditSeekerComponent,
    EditSeekerProfileComponent,
    SeekerProfileComponent,
    DuplicateValidatorDirective,
    SeekerRecommendedComponent,
    SeekerRecommendedAdComponent,
    ProfileComponent,
    ErrorModalComponent,
    ChoiceModalComponent,
    LoadingComponent,
    FilterBarComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CustomMaterialModule,
    NgbPaginationModule,
    NgbModalModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction
              [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean']
        ]
      }
    }),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    CookieService,
    EstablishmentValidatorDirective,
    DuplicateValidatorDirective,
    OptionsService,
    EditJobPostService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ChoiceModalComponent,
    LoadingComponent,
    SignupSplitComponent
  ]
})
export class AppModule { }
