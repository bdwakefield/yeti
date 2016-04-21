System.register(['angular2/core', 'angular2/router', "../services/auth.service", "../services/logger.service"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, router_1, auth_service_1, logger_service_1;
    var AuthRouterOutletDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            },
            function (logger_service_1_1) {
                logger_service_1 = logger_service_1_1;
            }],
        execute: function() {
            AuthRouterOutletDirective = (function (_super) {
                __extends(AuthRouterOutletDirective, _super);
                function AuthRouterOutletDirective(_elementRef, _loader, _parentRouter, nameAttr, auth, logger) {
                    _super.call(this, _elementRef, _loader, _parentRouter, nameAttr, auth, logger);
                    this.parentRouter = _parentRouter;
                    this.publicRoutes = {
                        '/admin/login': true
                    };
                    this.auth = auth;
                    this.logger = logger;
                }
                AuthRouterOutletDirective.prototype.activate = function (instruction) {
                    var _this = this;
                    var url = this.parentRouter.lastNavigationAttempt;
                    var token = localStorage.getItem('yeti.jwt');
                    if (!this.publicRoutes[url] && !token) {
                        this.parentRouter.navigateByUrl('/admin/login');
                    }
                    else if (token) {
                        this.auth.verifyToken().catch(function (err) {
                            localStorage.removeItem('yeti.jwt');
                            _this.parentRouter.navigateByUrl('/admin/login');
                            _this.logger.error(err);
                        });
                    }
                    return _super.prototype.activate.call(this, instruction);
                };
                AuthRouterOutletDirective = __decorate([
                    core_1.Directive({
                        selector: 'router-outlet'
                    }),
                    __param(3, core_1.Attribute('name')), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, router_1.Router, String, auth_service_1.AuthService, logger_service_1.LoggerService])
                ], AuthRouterOutletDirective);
                return AuthRouterOutletDirective;
            })(router_1.RouterOutlet);
            exports_1("AuthRouterOutletDirective", AuthRouterOutletDirective);
        }
    }
});
//# sourceMappingURL=auth-router-outlet.directive.js.map