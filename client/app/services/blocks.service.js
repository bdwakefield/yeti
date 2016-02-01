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
    var BlocksService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            }],
        execute: function() {
            BlocksService = (function () {
                function BlocksService(api) {
                    this.api = api;
                    this.cache = {
                        blockPromise: undefined
                    };
                }
                BlocksService.prototype.getBlock = function (id) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.cache.blockPromise = _this.cache.blockPromise || _this.api.get('/api/blocks');
                        _this.cache.blockPromise.then(function (blocks) { return resolve(blocks.find(function (block) { return block._id === id; })); });
                    });
                };
                BlocksService.prototype.getBlocks = function () {
                    this.cache.blockPromise = this.cache.blockPromise || this.api.get('/api/blocks');
                    return this.cache.blockPromise;
                };
                BlocksService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], BlocksService);
                return BlocksService;
            })();
            exports_1("BlocksService", BlocksService);
        }
    }
});
//# sourceMappingURL=blocks.service.js.map