import {Component} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {HTTP_PROVIDERS, Http, Request, RequestMethod, Headers} from 'angular2/http';
import {ApiService} from '../services/api.service';
import {ViewsService} from '../services/views.service';
import {BlocksService} from '../services/blocks.service';
import {ViewsToolbarComponent} from './views-toolbar.component';

@Component({
    templateUrl: 'app/templates/views.html',
    directives: [
        ROUTER_DIRECTIVES,
        ViewsToolbarComponent
    ]
})

export class ViewsComponent {
    constructor(
        public http:Http,
        public views:ViewsService,
        public routeParams:RouteParams,
        public blocksService:BlocksService,
        public parentRouter:Router
    ) {}

    model = {
        isSingleView: false,
        views: [],
        view: null,
        selectedView: '',
        blocks: []
    };

    ngOnInit() {
        var viewId = this.routeParams.params.id;
        this.model.selectedView = viewId;

        if (viewId) {
            this.views.getView(viewId).then(view => view)
            .then(view => {
                this.blocksService.getBlocks()
                .then(blocks => {
                    this.model.blocks = blocks;
                    if (~view.content.indexOf('{{')) {
                        this.insertBlockContent(view.content, this.model.blocks)
                            .then(modifiedView => {
                                this.model.view = modifiedView
                            });
                    }
                });
            });
        } else {
            this.views.getViews().then(views => {
                this.parentRouter.navigateByUrl('/admin/views/' + this.getDefaultView(views).id || views[0].id);
            });
        }
    }

    getDefaultView(views) {
        return _.find(views, view => view.defaultView);
    }

    insertBlockContent(view, blocks) {
        return new Promise((resolve, reject) => {
            this.http.get('app/templates/individualView.html')
                .subscribe(html => {
                    var htmlTemplate = _.template(html._body);
                    var modifiedView = '';
                    var embeddedBlocks = view.split(/\n/);

                    embeddedBlocks.forEach(function(block) {
                        var blockId = (/{{-([\s\S]*?)}}/g).exec(block)[1];
                        var blockContent = blocks.find(block => block._id === blockId);
                        blockContent.content = blockContent.type === 'blog' ? 'Blog Post Block' : blockContent.content;
                        modifiedView += htmlTemplate({
                            'blockId': blockContent._id,
                            'blockContent': blockContent.content,
                            'blockTitle': blockContent.title
                        });
                    });

                    resolve(modifiedView);
                });
        });
    }
}
