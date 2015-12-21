System.register(['angular2/core', "../services/api.service"], function(exports_1) {
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
    var core_1, api_service_1;
    var ViewsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            }],
        execute: function() {
            ViewsService = (function () {
                function ViewsService(api) {
                    this.api = api;
                    this.cache = {
                        views: undefined,
                        view: undefined
                    };
                }
                ViewsService.prototype.getViews = function () {
                    this.cache.views = this.cache.views || this.api.get('/api/views/edit');
                    return this.cache.views;
                };
                ViewsService.prototype.getView = function (id) {
                    this.cache.view = (this.cache.view && this.cache.view.id === id) ? this.cache.view : this.api.get('/api/views/edit/' + id);
                    return this.cache.view;
                };
                ViewsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], ViewsService);
                return ViewsService;
            })();
            exports_1("ViewsService", ViewsService);
        }
    }
});
//# sourceMappingURL=views.service.js.map