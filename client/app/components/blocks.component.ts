import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {ApiService} from "../services/api.service";
import {BlocksService} from "../services/blocks.service";

@Component({
    templateUrl: 'app/templates/blocks.html'
})

export class BlocksComponent {
    constructor(
        public blocks:BlocksService
    ) {}

    model = {
        blocks: []
    };

    ngOnInit() {
        this.blocks.getBlocks().then(blocks => this.model.blocks = blocks);
    }
}