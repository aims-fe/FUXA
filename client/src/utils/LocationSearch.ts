// import { isDevMode } from '@angular/core';

/**
 * 封装 location search 相关处理
 */
export class LocationSearch {
  static instance: LocationSearch;
  static getInstance(): LocationSearch {
    if (!LocationSearch.instance) {
      LocationSearch.instance = new LocationSearch();
    }
    return LocationSearch.instance;
  }

  private searchParams: URLSearchParams;

  constructor() {
    this.searchParams = new URLSearchParams(this.getLocationSearch());
  }

  getURLSearchParam(key: string) {
    return this.searchParams.get(key);
  }

  getURLSearchParams() {
    return this.searchParams;
  }

  // replaceState(keys: string[]) {
  //   const next = this.shake(keys);
  //   const search = this.getStringifySearch(next);
  //   const { origin, pathname, hash } = window.location;
  //   window.history.replaceState({}, '', `${origin}${pathname}${search}${hash}`);
  // }

  // private shake(keys: string[]) {
  //   const next = new URLSearchParams(this.searchParams);
  //   keys.forEach((key) => {
  //     next.delete(key);
  //   });
  //   return next;
  // }

  // private getStringifySearch(params: URLSearchParams) {
  //   const stringified = params.toString();
  //   return stringified ? `?${stringified}` : '';
  // }

  private getLocationSearch(){
    // if (!isDevMode()) {
    //   return window.location.search;
    // }
    // // 测试环境特殊处理
    if (window.location.search) {
      window.sessionStorage.setItem('LocationSearch', window.location.search);
      return window.location.search;
    }
    return window.sessionStorage.getItem('LocationSearch') || '';
  }
}

export default LocationSearch;
