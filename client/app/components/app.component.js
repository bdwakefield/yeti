System.register(['angular2/core', 'angular2/router', './main.component', './login.component', '../services/logger.service', "../services/auth.service", "../directives/auth-router-outlet.directive", "./views.component", "../services/api.service", "../services/views.service", "../services/blocks.service", "../services/template.service", "./blocks.component", 'rxjs/add/operator/map'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, main_component_1, login_component_1, logger_service_1, auth_service_1, auth_router_outlet_directive_1, views_component_1, api_service_1, views_service_1, blocks_service_1, template_service_1, blocks_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (main_component_1_1) {
                main_component_1 = main_component_1_1;
            },
            function (login_component_1_1) {
                login_component_1 = login_component_1_1;
            },
            function (logger_service_1_1) {
                logger_service_1 = logger_service_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            },
            function (auth_router_outlet_directive_1_1) {
                auth_router_outlet_directive_1 = auth_router_outlet_directive_1_1;
            },
            function (views_component_1_1) {
                views_component_1 = views_component_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (views_service_1_1) {
                views_service_1 = views_service_1_1;
            },
            function (blocks_service_1_1) {
                blocks_service_1 = blocks_service_1_1;
            },
            function (template_service_1_1) {
                template_service_1 = template_service_1_1;
            },
            function (blocks_component_1_1) {
                blocks_component_1 = blocks_component_1_1;
            },
            function (_1) {}],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'yeti',
                        templateUrl: 'app/templates/app.html',
                        styleUrls: ['app/styles/site.css'],
                        directives: [
                            router_1.ROUTER_DIRECTIVES,
                            auth_router_outlet_directive_1.AuthRouterOutletDirective
                        ],
                        providers: [
                            logger_service_1.LoggerService,
                            auth_service_1.AuthService,
                            api_service_1.ApiService,
                            views_service_1.ViewsService,
                            blocks_service_1.BlocksService,
                            template_service_1.TemplateService
                        ]
                    }),
                    router_1.RouteConfig([
                        { path: '/admin', name: 'Main', component: main_component_1.MainComponent, useAsDefault: true },
                        { path: '/admin/login', name: 'Login', component: login_component_1.LoginComponent },
                        { path: '/admin/views', name: 'Views', component: views_component_1.ViewsComponent },
                        { path: '/admin/views/:id', name: 'ViewById', component: views_component_1.ViewsComponent },
                        { path: '/admin/blocks', name: 'Blocks', component: blocks_component_1.BlocksComponent },
                        { path: '/admin/blocks/:id', name: 'BlocksById', component: blocks_component_1.BlocksComponent }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map