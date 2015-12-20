import {Injectable} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Request, RequestMethod, Headers} from 'angular2/http';

@Injectable()
export class ApiService {
    constructor(
        public http:Http
    ) {}

    post(url: any, body: Object) {
        return new Promise((resolve, reject) => {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Access-Control-Allow-Origin', 'http://localhost:3002');

            this.http.post(
                url,
                JSON.stringify(body),
                {
                    headers: headers
                })
                .map(res => res.json())
                .subscribe(
                    data => resolve(data),
                    err => reject(err)
                );
        });
    }

    get(url: any) {
        return new Promise((resolve, reject) => {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Access-Control-Allow-Origin', 'http://localhost:3002');

            this.http.get(url)
                .map(res => res.json())
                .subscribe(
                    data => resolve(data),
                    err => reject(err)
                );
        });
    }
}