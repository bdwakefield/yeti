import {Component} from 'angular2/core';
import {AuthService} from "../services/auth.service";
import {LoggerService} from "../services/logger.service";
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';

@Component({
    templateUrl: 'app/templates/login.html',
    styleUrls: ['app/styles/login.css']
})

export class LoginComponent {
    constructor(
        public auth: AuthService,
        public logger: LoggerService,
        private parentRouter:Router
    ) {}

    model = {
        userName: null,
        password: null
    };

    login() {
        this.auth.login(this.model.userName, this.model.password)
        .then(() => {
            this.parentRouter.navigateByUrl('/admin');
        })
        .catch(err => {
            this.logger.error(err)
        });
    }
}