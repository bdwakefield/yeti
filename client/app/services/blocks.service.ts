import {Injectable} from 'angular2/core';
import {ApiService} from "../services/api.service";

@Injectable()
export class BlocksService {
    constructor(
        public api:ApiService
    ) {}

    cache = {
        blocks: undefined,
        block: undefined
    };

    getBlock(id) {
        this.cache.block = (this.cache.block && this.cache.block.id === id) ? this.cache.block : this.api.get('/api/blocks/' + id);
        return this.cache.block;
    }

    getBlocks(bustCache) {
        this.cache.blocks = (this.cache.blocks && !bustCache) ? this.cache.blocks : this.api.get('/api/blocks');
        return this.cache.blocks;
    }
}