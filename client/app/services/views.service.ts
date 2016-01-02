import {Injectable} from 'angular2/core';
import {ApiService} from "../services/api.service";

@Injectable()
export class ViewsService {
    constructor(
        public api:ApiService
    ) {}

    cache = {
        views: undefined,
        view: undefined
    };

    getViews() {
        this.cache.views = this.cache.views || this.api.get('/api/views/edit');
        return this.cache.views;
    }

    getView(id) {
        this.cache.view = (this.cache.view && this.cache.view.id === id) ? this.cache.view : this.api.get('/api/views/edit/' + id);
        return this.cache.view;
    }

    makeDefault(id) {
        this.cache.views = null;
        this.cache.view = null;
        return this.api.post('/api/views/makeDefault', {
            viewId: id
        });
    }
}