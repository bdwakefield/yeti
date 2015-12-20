import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {MainComponent} from './main.component';
import {LoginComponent} from './login.component';
import {LoggerService} from '../services/logger.service';
import 'rxjs/add/operator/map';
import {AuthService} from "../services/auth.service";
import {AuthRouterOutletDirective} from "../directives/auth-router-outlet.directive";
import {ViewsComponent} from "./views.component";
import {ApiService} from "../services/api.service";
import {ViewsService} from "../services/views.service";

@Component({
    selector: 'yeti',
    template: `
        <a [routerLink]="['Main']">Main</a>
        <a [routerLink]="['Login']">Login</a>
        <a [routerLink]="['Views']">Views</a>
        <router-outlet></router-outlet>
    `,
    styleUrls: ['app/styles/site.css'],
    directives: [
        ROUTER_DIRECTIVES,
        AuthRouterOutletDirective
    ],
    providers: [
        LoggerService,
        AuthService,
        ApiService,
        ViewsService
    ]
})

@RouteConfig([
    {path: '/admin', name: 'Main', component: MainComponent, useAsDefault: true},
    {path: '/admin/login', name: 'Login', component: LoginComponent},
    {path: '/admin/views', name: 'Views', component: ViewsComponent}
])

export class AppComponent {}