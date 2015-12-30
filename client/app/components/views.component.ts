import {Component} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, RouterLink} from 'angular2/router';
import {HTTP_PROVIDERS, Http, Request, RequestMethod, Headers} from 'angular2/http';
import {ApiService} from '../services/api.service';
import {ViewsService} from '../services/views.service';
import {BlocksService} from '../services/blocks.service';

@Component({
    templateUrl: 'app/templates/views.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class ViewsComponent {
    constructor(
        public http:Http,
        public views:ViewsService,
        public routeParams:RouteParams,
        public blocksService:BlocksService
    ) {}

    model = {
        isSingleView: false,
        views: [],
        view: null,
        blocks: []
    };

    ngOnInit() {
        var viewId = this.routeParams.params.id;

        if (viewId) {
            this.model.isSingleView = true;

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
            this.model.isSingleView = false;
            this.views.getViews().then(views => this.model.views = views);
        }
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
