
import { HttpRequest } from '@angular/common/http';
import LocationSearch from './LocationSearch';


function replaceURL(req: HttpRequest<any>){
  const origin = window.location.origin;

  const url = new URL(req.url);
  const pathname = url.pathname.replace(/^\/api\//, '/api-superconf/fuxa/');

  // 将页面初始化传入的参数透传给后端
  const searchParams = LocationSearch.getInstance().getURLSearchParams();
  url.searchParams.forEach((value, key) => {
    searchParams.set(key, value);
  });
  const search = searchParams.toString() && `?${searchParams.toString()}`;

  return req.clone({ url: `${origin}${pathname}${search}`});
}


export function interceptRequest(req: HttpRequest<any>){
  if (!req?.url.startsWith('http')) {
    return req;
  }
  return replaceURL(req);
}

export const serviceUtils = { interceptRequest };

export default serviceUtils;
