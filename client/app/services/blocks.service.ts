import {Injectable} from 'angular2/core';
import {ApiService} from "../services/api.service";

@Injectable()
export class BlocksService {
    constructor(
        public api:ApiService
    ) {}

    cache = {
        blockPromise: undefined
    };

    getBlock(id) {
        return new Promise((resolve, reject) => {
            this.cache.blockPromise = this.cache.blockPromise || this.api.get('/api/blocks');
            this.cache.blockPromise.then(blocks => resolve(blocks.find(block => block._id === id)));
        });
    }

    getBlocks() {
        this.cache.blockPromise = this.cache.blockPromise || this.api.get('/api/blocks');
        return this.cache.blockPromise;
    }
}