System.register(['angular2/core', 'angular2/router', "../services/views.service"], function(exports_1) {
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
    var core_1, router_1, views_service_1;
    var ViewsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (views_service_1_1) {
                views_service_1 = views_service_1_1;
            }],
        execute: function() {
            ViewsComponent = (function () {
                function ViewsComponent(views, routeParams) {
                    this.views = views;
                    this.routeParams = routeParams;
                    this.model = {
                        isSingleView: false,
                        views: [],
                        view: {}
                    };
                }
                ViewsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var viewId = this.routeParams.params.id;
                    if (viewId) {
                        this.model.isSingleView = true;
                        this.views.getView(viewId).then(function (view) { return _this.model.view = view; });
                        console.log(this.model);
                    }
                    else {
                        this.model.isSingleView = false;
                        this.views.getViews().then(function (views) { return _this.model.views = views; });
                    }
                };
                ViewsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/templates/views.html',
                        directives: [
                            router_1.ROUTER_DIRECTIVES
                        ]
                    }), 
                    __metadata('design:paramtypes', [views_service_1.ViewsService, router_1.RouteParams])
                ], ViewsComponent);
                return ViewsComponent;
            })();
            exports_1("ViewsComponent", ViewsComponent);
        }
    }
});
//# sourceMappingURL=views.component.js.map