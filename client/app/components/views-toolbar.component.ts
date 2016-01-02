import {Component, Input} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {ViewsService} from '../services/views.service';

@Component({
    selector: 'viewsToolbar',
    templateUrl: 'app/templates/views-toolbar.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class ViewsToolbarComponent {
    @Input() currentView: string;
    constructor(
        public views:ViewsService,
        public parentRouter:Router
    ) {}

    model = {
        isSingleView: false,
        views: [],
        view: {},
        isDefaultView: false,
        selectedView: null,
        blocks: []
    };

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.views.getViews().then(views => {
            this.model.views = views;
            this.model.selectedView = this.currentView;
            this.model.view = _.find(views, view => view.id === this.model.selectedView);
        });
    }

    gotoView(event) {
        this.parentRouter.navigateByUrl('/admin/views/' + event);
    }

    makeDefault() {
        this.views.makeDefault(this.model.selectedView).then(result => this.initialize());
    }
}
