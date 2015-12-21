import {Component} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {ApiService} from "../services/api.service";
import {ViewsService} from "../services/views.service";

@Component({
    templateUrl: 'app/templates/views.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class ViewsComponent {
    constructor(
        public views:ViewsService,
        public routeParams:RouteParams
    ) {}

    model = {
        isSingleView: false,
        views: [],
        view: {}
    };

    ngOnInit() {
        var viewId = this.routeParams.params.id;

        if (viewId) {
            this.model.isSingleView = true;
            this.views.getView(viewId).then(view => this.model.view = view);
            console.log(this.model);
        } else {
            this.model.isSingleView = false;
            this.views.getViews().then(views => this.model.views = views);
        }
    }
}
