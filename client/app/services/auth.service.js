System.register(['angular2/core', "./api.service"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, api_service_1;
    var AuthService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            }],
        execute: function() {
            AuthService = (function () {
                function AuthService(api) {
                    this.api = api;
                }
                AuthService.prototype.login = function (userName, password) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.api.post('/api/users/verify', {
                            username: userName,
                            password: password
                        })
                            .then(function (result) {
                            _this.saveToken(result.token).then(function (token) {
                                resolve(token);
                            })
                                .catch(function (err) {
                                reject(err);
                            });
                        });
                    });
                };
                AuthService.prototype.verifyToken = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.api.post('/api/users/verifytoken', {
                            token: localStorage.getItem('yeti.jwt')
                        })
                            .then(function (result) { return resolve(result); })
                            .catch(function (err) { return reject(err); });
                    });
                };
                AuthService.prototype.saveToken = function (token) {
                    return new Promise(function (resolve, reject) {
                        localStorage.setItem('yeti.jwt', token);
                        resolve(token);
                    });
                };
                AuthService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], AuthService);
                return AuthService;
            })();
            exports_1("AuthService", AuthService);
        }
    }
});
//# sourceMappingURL=auth.service.js.map