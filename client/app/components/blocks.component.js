System.register(['angular2/core', 'angular2/router', "../services/blocks.service"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, blocks_service_1;
    var BlocksComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (blocks_service_1_1) {
                blocks_service_1 = blocks_service_1_1;
            }],
        execute: function() {
            BlocksComponent = (function () {
                function BlocksComponent(blocks, routeParams) {
                    this.blocks = blocks;
                    this.routeParams = routeParams;
                    this.model = {
                        isSingleBlock: false,
                        blocks: [],
                        block: {}
                    };
                }
                BlocksComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var blockId = this.routeParams.params.id;
                    if (blockId) {
                        this.model.isSingleBlock = true;
                        this.blocks.getBlock(this.routeParams.params.id).then(function (block) { return _this.model.block = block.content; });
                    }
                    else {
                        this.model.isSingleBlock = false;
                        this.blocks.getBlocks().then(function (blocks) { return _this.model.blocks = blocks; });
                    }
                };
                BlocksComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/templates/blocks.html',
                        directives: [
                            router_1.ROUTER_DIRECTIVES
                        ]
                    }), 
                    __metadata('design:paramtypes', [blocks_service_1.BlocksService, router_1.RouteParams])
                ], BlocksComponent);
                return BlocksComponent;
            })();
            exports_1("BlocksComponent", BlocksComponent);
        }
    }
});
//# sourceMappingURL=blocks.component.js.map