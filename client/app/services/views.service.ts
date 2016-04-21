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

    getViews(bustCache) {
        this.cache.views = (this.cache.views && !bustCache) ? this.cache.views : this.api.get('/api/views/edit');
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

    addView(viewName) {
        return this.api.post('/api/views/addView', {
            viewName: viewName
        });
    }

    postView(viewId, viewContent, viewRoute, viewIsDefault) {
        return this.api.post('/api/views', {
            viewId: viewId,
            viewContent: viewContent,
            viewRoute: viewRoute,
            viewIsDefault: viewIsDefault
        });
    }

    deleteView(viewId) {
        return this.api.post('/api/views/deleteView', {
            viewId: viewId
        });
    }
}