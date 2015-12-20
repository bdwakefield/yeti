System.register(['angular2/core', 'angular2/http'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var ApiService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            ApiService = (function () {
                function ApiService(http) {
                    this.http = http;
                }
                ApiService.prototype.post = function (url, body) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var headers = new http_1.Headers();
                        headers.append('Content-Type', 'application/json');
                        headers.append('Access-Control-Allow-Origin', 'http://localhost:3002');
                        _this.http.post(url, JSON.stringify(body), {
                            headers: headers
                        })
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) { return resolve(data); }, function (err) { return reject(err); });
                    });
                };
                ApiService.prototype.get = function (url) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var headers = new http_1.Headers();
                        headers.append('Content-Type', 'application/json');
                        headers.append('Access-Control-Allow-Origin', 'http://localhost:3002');
                        _this.http.get(url)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) { return resolve(data); }, function (err) { return reject(err); });
                    });
                };
                ApiService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ApiService);
                return ApiService;
            })();
            exports_1("ApiService", ApiService);
        }
    }
});
//# sourceMappingURL=api.service.js.map