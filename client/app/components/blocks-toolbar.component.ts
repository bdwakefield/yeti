import {Component, Input, EventEmitter} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {BlocksService} from '../services/blocks.service';

@Component({
    selector: 'blocksToolbar',
    templateUrl: 'app/templates/blocks-toolbar.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    events: ['blockChanged']
})

export class BlocksToolbarComponent {
    @Input() currentBlock: string;
    constructor(
        public blocks:BlocksService
    ) {}

    blockChanged = new EventEmitter();
    model = {
        block: {},
        blocks: [],
        selectedBlock: null,
        addBlockName: null
    };

    ngOnInit() {
        this.initialize(null);
    }

    initialize(blockId) {
        this.blocks.getBlocks(true).then(blocks => {
            this.model.blocks = blocks;

            if (blockId) {
                this.model.selectedBlock = blockId;
                this.blockChanged.emit(blockId);
            } else {
                this.model.selectedBlock = this.currentBlock;
            }

            this.model.block = blocks.find(block => block._id === this.model.selectedBlock);
        });
    }

    refresh(blockId) {
        this.currentBlock = this.model.selectedBlock = blockId;
        this.blocks.getBlocks(true).then(blocks => {
            this.model.block = blocks.find(block => block._id === this.model.selectedBlock);
        });
    }

    gotoBlock(event) {
        this.refresh(event);
        this.blockChanged.emit(event);
    }
}
