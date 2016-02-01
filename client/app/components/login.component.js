System.register(['angular2/core', "../services/auth.service", "../services/logger.service", 'angular2/router'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
            case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
            case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
            case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
        }
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, auth_service_1, logger_service_1, router_1;
    var LoginComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (auth_service_1_1) {
                auth_service_1 = auth_service_1_1;
            },
            function (logger_service_1_1) {
                logger_service_1 = logger_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            LoginComponent = (function () {
                function LoginComponent(auth, logger, parentRouter) {
                    this.auth = auth;
                    this.logger = logger;
                    this.parentRouter = parentRouter;
                    this.model = {
                        userName: null,
                        password: null
                    };
                }
                LoginComponent.prototype.login = function () {
                    var _this = this;
                    this.auth.login(this.model.userName, this.model.password)
                        .then(function () {
                        _this.parentRouter.navigateByUrl('/admin');
                    })
                        .catch(function (err) {
                        _this.logger.error(err);
                    });
                };
                LoginComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/templates/login.html',
                        styleUrls: ['app/styles/login.css']
                    }), 
                    __metadata('design:paramtypes', [auth_service_1.AuthService, logger_service_1.LoggerService, router_1.Router])
                ], LoginComponent);
                return LoginComponent;
            })();
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
//# sourceMappingURL=login.component.js.map