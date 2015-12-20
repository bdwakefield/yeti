import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {AppComponent} from './components/app.component';
import {HTTP_PROVIDERS, Http, Request, RequestMethod} from 'angular2/http';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS
]);