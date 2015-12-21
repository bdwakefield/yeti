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

    getBlocks() {
        this.cache.blockPromise = this.cache.blockPromise || this.api.get('/api/blocks');
        return this.cache.blockPromise;
    }
}