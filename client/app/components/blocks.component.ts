import {Component} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {ApiService} from "../services/api.service";
import {BlocksService} from "../services/blocks.service";
import {BlocksToolbarComponent} from './blocks-toolbar.component';

@Component({
    templateUrl: 'app/templates/blocks.html',
    directives: [
        ROUTER_DIRECTIVES,
        BlocksToolbarComponent
    ]
})

export class BlocksComponent {
    constructor(
        public blocksService:BlocksService,
        public routeParams:RouteParams
    ) {}

    model = {
        isSingleBlock: false,
        blocks: [],
        block: null,
        selectedBlock: ''
    };

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.model.selectedBlock = this.model.selectedBlock || this.routeParams.get('blockId');
        var blockId = this.model.selectedBlock;

        if (blockId) {
            this.blocksService.getBlock(blockId).then(block => {
                this.model.block = block;
            });
        } else {
            this.blocksService.getBlocks(null).then(blocks => {
                this.model.selectedBlock = blocks[0]._id;
                this.initialize();
            });
        }
    }

    changeBlock(event) {
        this.model.selectedBlock = event;
        this.initialize();
    }
}