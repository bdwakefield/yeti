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
import {BlocksService} from "../services/blocks.service";
import {TemplateService} from "../services/template.service";
import {BlocksComponent} from "./blocks.component";

@Component({
    selector: 'yeti',
    templateUrl: 'app/templates/app.html',
    styleUrls: ['app/styles/site.css'],
    directives: [
        ROUTER_DIRECTIVES,
        AuthRouterOutletDirective
    ],
    providers: [
        LoggerService,
        AuthService,
        ApiService,
        ViewsService,
        BlocksService,
        TemplateService
    ]
})

@RouteConfig([
    {path: '/admin', name: 'Main', component: MainComponent, useAsDefault: true},
    {path: '/admin/login', name: 'Login', component: LoginComponent},
    {path: '/admin/views', name: 'Views', component: ViewsComponent},
    {path: '/admin/views/:id', name: 'ViewById', component: ViewsComponent},
    {path: '/admin/blocks', name: 'Blocks', component: BlocksComponent},
    {path: '/admin/blocks/:id', name: 'BlocksById', component: BlocksComponent}
])

export class AppComponent {}