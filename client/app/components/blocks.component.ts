import {Component} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {ApiService} from "../services/api.service";
import {BlocksService} from "../services/blocks.service";

@Component({
    templateUrl: 'app/templates/blocks.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class BlocksComponent {
    constructor(
        public blocks:BlocksService,
        public routeParams:RouteParams
    ) {}

    model = {
        isSingleBlock: false,
        blocks: [],
        block: null
    };

    ngOnInit() {
        var blockId = this.routeParams.params.id;

        if (blockId) {
            this.model.isSingleBlock = true;
            this.blocks.getBlock(this.routeParams.params.id).then(block => this.model.block = block.content);
        } else {
            this.model.isSingleBlock = false;
            this.blocks.getBlocks().then(blocks => this.model.blocks = blocks);
        }
    }
}