import {Injectable} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Request, RequestMethod, Headers} from 'angular2/http';

@Injectable()
export class TemplateService {
    constructor(
        public http:Http
    ) {}

    smash(template: any) {
        return new Promise((resolve, reject) => {
            this.http.get(template)
                .subscribe(html => {
                    resolve(_.template(html))
                });
        });
    }
}