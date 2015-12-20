import {Component} from 'angular2/core';
import {AuthService} from "../services/auth.service";
import {LoggerService} from "../services/logger.service";

@Component({
    templateUrl: 'app/templates/login.html',
    styleUrls: ['app/styles/login.css']
})

export class LoginComponent {
    constructor(
        public auth: AuthService,
        public logger: LoggerService
    ) {}

    model = {
        userName: null,
        password: null
    };

    login() {
        this.auth.login(this.model.userName, this.model.password)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            this.logger.error(err)
        });
    }
}