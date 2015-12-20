import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {ApiService} from "../services/api.service";
import {ViewsService} from "../services/views.service";

@Component({
    templateUrl: 'app/templates/views.html'
})

export class ViewsComponent {
    constructor(
        public views:ViewsService
    ) {}

    model = {
        views: []
    };

    ngOnInit() {
        this.views.getViews().then(views => this.model.views = views);
    }
}