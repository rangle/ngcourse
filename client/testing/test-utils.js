function getService(serviceName) {
  var injectedService;
  inject([serviceName, function (serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}