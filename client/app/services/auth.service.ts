import {Injectable} from 'angular2/core';
import {ApiService} from "./api.service";

@Injectable()
export class AuthService {
    constructor(
        public api:ApiService
    ) {}

    login(userName: any, password: any) {
        return new Promise((resolve, reject) => {
            this.api.post('/api/users/verify', {
                username: userName,
                password: password
            })
            .then(result => {
                this.saveToken(result.token).then(token => {
                    resolve(token);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    }

    verifyToken() {
        return new Promise((resolve, reject) => {
            this.api.post('/api/users/verifytoken', {
                    token: localStorage.getItem('yeti.jwt')
                })
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }

    saveToken(token) {
        return new Promise((resolve, reject) => {
            localStorage.setItem('yeti.jwt', token);
            resolve(token);
        });
    }
}