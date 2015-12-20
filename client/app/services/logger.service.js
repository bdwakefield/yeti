System.register([], function(exports_1) {
    var LoggerService;
    return {
        setters:[],
        execute: function() {
            LoggerService = (function () {
                function LoggerService() {
                }
                LoggerService.prototype.error = function (message) {
                    console.log(message);
                };
                return LoggerService;
            })();
            exports_1("LoggerService", LoggerService);
        }
    }
});
//# sourceMappingURL=logger.service.js.map