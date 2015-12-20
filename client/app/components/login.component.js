System.register(['angular2/core', "../services/auth.service", "../services/logger.service"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, auth_service_1, logger_service_1;
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
            }],
        execute: function() {
            LoginComponent = (function () {
                function LoginComponent(auth, logger) {
                    this.auth = auth;
                    this.logger = logger;
                    this.model = {
                        userName: null,
                        password: null
                    };
                }
                LoginComponent.prototype.login = function () {
                    var _this = this;
                    this.auth.login(this.model.userName, this.model.password)
                        .then(function (result) {
                        console.log(result);
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
                    __metadata('design:paramtypes', [auth_service_1.AuthService, logger_service_1.LoggerService])
                ], LoginComponent);
                return LoginComponent;
            })();
            exports_1("LoginComponent", LoginComponent);
        }
    }
});
//# sourceMappingURL=login.component.js.map