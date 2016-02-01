System.register(['angular2/core', 'angular2/router', 'angular2/http', '../services/views.service', '../services/blocks.service', './views-toolbar.component'], function(exports_1) {
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
    var core_1, router_1, http_1, views_service_1, blocks_service_1, views_toolbar_component_1;
    var ViewsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (views_service_1_1) {
                views_service_1 = views_service_1_1;
            },
            function (blocks_service_1_1) {
                blocks_service_1 = blocks_service_1_1;
            },
            function (views_toolbar_component_1_1) {
                views_toolbar_component_1 = views_toolbar_component_1_1;
            }],
        execute: function() {
            ViewsComponent = (function () {
                function ViewsComponent(http, views, routeParams, blocksService, parentRouter) {
                    this.http = http;
                    this.views = views;
                    this.routeParams = routeParams;
                    this.blocksService = blocksService;
                    this.parentRouter = parentRouter;
                    this.model = {
                        isSingleView: false,
                        views: [],
                        view: null,
                        selectedView: '',
                        blocks: []
                    };
                }
                ViewsComponent.prototype.ngOnInit = function () {
                    this.initialize();
                };
                ViewsComponent.prototype.initialize = function () {
                    var _this = this;
                    var viewId = this.routeParams.params.id;
                    this.model.selectedView = viewId;
                    if (viewId) {
                        this.views.getView(viewId).then(function (view) { return view; })
                            .then(function (view) {
                            _this.blocksService.getBlocks()
                                .then(function (blocks) {
                                _this.model.blocks = blocks;
                                if (~view.content.indexOf('{{')) {
                                    _this.insertBlockContent(view.content, _this.model.blocks)
                                        .then(function (modifiedView) {
                                        _this.model.view = modifiedView;
                                    });
                                }
                            });
                        });
                    }
                    else {
                        this.views.getViews().then(function (views) {
                            _this.parentRouter.navigateByUrl('/admin/views/' + _this.getDefaultView(views).id || views[0].id);
                        });
                    }
                };
                ViewsComponent.prototype.getDefaultView = function (views) {
                    return _.find(views, function (view) { return view.defaultView; });
                };
                ViewsComponent.prototype.insertBlockContent = function (view, blocks) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.http.get('app/templates/individualView.html')
                            .subscribe(function (html) {
                            var htmlTemplate = _.template(html._body);
                            var modifiedView = '';
                            var embeddedBlocks = view.split(/\n/);
                            embeddedBlocks.forEach(function (block) {
                                var blockId = (/{{-([\s\S]*?)}}/g).exec(block)[1];
                                var blockContent = blocks.find(function (block) { return block._id === blockId; });
                                blockContent.content = blockContent.type === 'blog' ? 'Blog Post Block' : blockContent.content;
                                modifiedView += htmlTemplate({
                                    'blockId': blockContent._id,
                                    'blockContent': blockContent.content,
                                    'blockTitle': blockContent.title
                                });
                            });
                            resolve(modifiedView);
                        });
                    });
                };
                ViewsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/templates/views.html',
                        directives: [
                            router_1.ROUTER_DIRECTIVES,
                            views_toolbar_component_1.ViewsToolbarComponent
                        ]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, views_service_1.ViewsService, router_1.RouteParams, blocks_service_1.BlocksService, router_1.Router])
                ], ViewsComponent);
                return ViewsComponent;
            })();
            exports_1("ViewsComponent", ViewsComponent);
        }
    }
});
//# sourceMappingURL=views.component.js.map