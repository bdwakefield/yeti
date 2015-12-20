import {Injectable} from 'angular2/core';
import {ApiService} from "../services/api.service";

@Injectable()
export class ViewsService {
    constructor(
        public api:ApiService
    ) {}

    cache = {
        viewPromise: undefined
    };

    getViews() {
        this.cache.viewPromise = this.cache.viewPromise || this.api.get('/api/views/edit');
        return this.cache.viewPromise;
    }
}