import {Component, Input, EventEmitter} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {ViewsService} from '../services/views.service';
import {BlocksService} from "../services/blocks.service";

@Component({
    selector: 'viewsToolbar',
    templateUrl: 'app/templates/views-toolbar.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    events: ['viewChanged'],
    host: {
        '(ondrop)': 'onDrop($event)'
    }
})

export class ViewsToolbarComponent {
    @Input() currentView: string;
    constructor(
        public views:ViewsService,
        public blocks:BlocksService
    ) {
        this.viewChanged = new EventEmitter();
    }

    model = {
        isSingleView: false,
        views: [],
        view: {},
        blocks: [],
        isDefaultView: false,
        selectedView: null,
        selectedBlock: null,
        addViewName: null
    };

    ngOnInit() {
        this.initialize();
    }

    initialize(viewId) {
        this.views.getViews(true).then(views => {
            this.model.views = views;

            if (viewId) {
                this.model.selectedView = viewId;
                this.viewChanged.emit(viewId);
            } else {
                this.model.selectedView = this.currentView;
            }

            this.model.view = _.find(views, view => view.id === this.model.selectedView);
            this.blocks.getBlocks().then(blocks => {
                this.model.blocks = blocks;
                this.model.selectedBlock = blocks[0]._id
            });
        });
    }

    refresh(viewId) {
        this.currentView = this.model.selectedView = viewId;
        this.views.getViews(true).then(views => {
            this.model.view = _.find(views, view => view.id === this.model.selectedView);
        });
    }

    gotoView(event) {
        this.refresh(event);
        this.viewChanged.emit(event);
    }

    addView() {
        this.views.addView(this.model.addViewName).then(result => this.initialize(result._id));
    }

    addBlock() {
        var blockToAdd = this.model.selectedBlock;
        var currentView = this.model.view;
        var viewContent = (!~currentView.content.indexOf('{{')) ? '{{-' + blockToAdd + '}}' :  currentView.content + '\n{{-' + blockToAdd + '}}';

        this.views.postView(currentView.id, viewContent, currentView.route, currentView.defaultView).then(result => this.gotoView(currentView.id));
    }

    makeDefault() {
        this.views.makeDefault(this.model.selectedView).then(result => this.refresh(this.model.selectedView));
    }

    deleteView() {
        this.views.deleteView(this.model.selectedView).then(result => {
            this.views.getViews(true).then(views => {
                this.initialize(views[0].id);
            });
        });
    }

    saveView() {
        var currentView = this.model.view;

        this.views.postView(currentView.id, this.getModifiedView(), currentView.route, currentView.defaultView).then(result => this.gotoView(currentView.id));
    }

    getModifiedView() {
        var viewContent = '';
        _.forEach(document.getElementById('viewEditor').childNodes, function(block) {
            if (block.id) {
                viewContent += '{{-' + block.id + '}}\n';
            }
        });
        return viewContent.replace(/\n$/, '');
    }

    onDrop(event) {
        console.log(event);
    }
}
