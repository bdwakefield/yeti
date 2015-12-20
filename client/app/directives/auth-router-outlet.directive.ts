import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';
import {AuthService} from "../services/auth.service";
import {LoggerService} from "../services/logger.service";

@Directive({
    selector: 'router-outlet'
})
export class AuthRouterOutletDirective extends RouterOutlet {
    publicRoutes:any;
    private parentRouter:Router;
    auth:AuthService;
    logger:LoggerService;

    constructor(
        _elementRef:ElementRef,
        _loader:DynamicComponentLoader,
        _parentRouter:Router,
        @Attribute('name') nameAttr:string,
        auth:AuthService,
        logger:LoggerService
    ) {
        super(
            _elementRef,
            _loader,
            _parentRouter,
            nameAttr,
            auth,
            logger
        );

        this.parentRouter = _parentRouter;
        this.publicRoutes = {
            '/admin/login': true
        };
        this.auth = auth;
        this.logger = logger;
    }

    activate(instruction: ComponentInstruction) {
        var url = this.parentRouter.lastNavigationAttempt;
        var token = localStorage.getItem('yeti.jwt');
        if (!this.publicRoutes[url] && !token) {
            this.parentRouter.navigateByUrl('/admin/login');
        } else if(token) {
            this.auth.verifyToken().catch(err => {
                localStorage.removeItem('yeti.jwt');
                this.parentRouter.navigateByUrl('/admin/login');
                this.logger.error(err);
            });
        }
        return super.activate(instruction);
    }
}