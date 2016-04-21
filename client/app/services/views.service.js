System.register(['angular2/core', "../services/api.service"], function(exports_1) {
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
                ViewsService.prototype.getViews = function (bustCache) {
                    this.cache.views = (this.cache.views && !bustCache) ? this.cache.views : this.api.get('/api/views/edit');
                    return this.cache.views;
                };
                ViewsService.prototype.getView = function (id) {
                    this.cache.view = (this.cache.view && this.cache.view.id === id) ? this.cache.view : this.api.get('/api/views/edit/' + id);
                    return this.cache.view;
                };
                ViewsService.prototype.makeDefault = function (id) {
                    this.cache.views = null;
                    this.cache.view = null;
                    return this.api.post('/api/views/makeDefault', {
                        viewId: id
                    });
                };
                ViewsService.prototype.addView = function (viewName) {
                    return this.api.post('/api/views/addView', {
                        viewName: viewName
                    });
                };
                ViewsService.prototype.postView = function (viewId, viewContent, viewRoute, viewIsDefault) {
                    return this.api.post('/api/views', {
                        viewId: viewId,
                        viewContent: viewContent,
                        viewRoute: viewRoute,
                        viewIsDefault: viewIsDefault
                    });
                };
                ViewsService.prototype.deleteView = function (viewId) {
                    return this.api.post('/api/views/deleteView', {
                        viewId: viewId
                    });
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