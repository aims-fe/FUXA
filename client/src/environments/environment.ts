declare function require(moduleName: string): any;
export const environment = {
  version: require('../../package.json').version,
  production: false,
  // NOTE: 定制化修改
  apiEndpoint: window.location.origin,
  apiPort: 1881,
  serverEnabled: true,
  type: null,
  // NOTE: 定制化修改
  urmsAPI: '/api-urms',
  monitorAPI: '/api-monitor',
  fileAPI: '/api-file',
  fuxaAPI: '/api-superconf/fuxa',
  asmartSocketIO: '/asmart/socket.io',
};
