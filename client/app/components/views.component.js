System.register(['angular2/core', 'angular2/router', 'angular2/http', '../services/views.service', '../services/blocks.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, http_1, views_service_1, blocks_service_1;
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
            }],
        execute: function() {
            ViewsComponent = (function () {
                function ViewsComponent(http, views, routeParams, blocksService) {
                    this.http = http;
                    this.views = views;
                    this.routeParams = routeParams;
                    this.blocksService = blocksService;
                    this.model = {
                        isSingleView: false,
                        views: [],
                        view: null,
                        blocks: []
                    };
                }
                ViewsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var viewId = this.routeParams.params.id;
                    if (viewId) {
                        this.model.isSingleView = true;
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
                        this.model.isSingleView = false;
                        this.views.getViews().then(function (views) { return _this.model.views = views; });
                    }
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
                            router_1.ROUTER_DIRECTIVES
                        ]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, views_service_1.ViewsService, router_1.RouteParams, blocks_service_1.BlocksService])
                ], ViewsComponent);
                return ViewsComponent;
            })();
            exports_1("ViewsComponent", ViewsComponent);
        }
    }
});
//# sourceMappingURL=views.component.js.map