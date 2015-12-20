System.register(['angular2/core', "../services/views.service"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, views_service_1;
    var ViewsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (views_service_1_1) {
                views_service_1 = views_service_1_1;
            }],
        execute: function() {
            ViewsComponent = (function () {
                function ViewsComponent(views) {
                    this.views = views;
                    this.model = {
                        views: []
                    };
                }
                ViewsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.views.getViews().then(function (views) { return _this.model.views = views; });
                };
                ViewsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/templates/views.html'
                    }), 
                    __metadata('design:paramtypes', [views_service_1.ViewsService])
                ], ViewsComponent);
                return ViewsComponent;
            })();
            exports_1("ViewsComponent", ViewsComponent);
        }
    }
});
//# sourceMappingURL=views.component.js.map