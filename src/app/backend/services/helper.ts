import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as _ from 'lodash';

export function buildQueryParams(query: any) {
    let params: HttpParams = new HttpParams();
    for (const key of Object.keys(query)) {
        if (query[key] || query[key] === 0) {
            if (query[key] instanceof Array) {
                query[key].forEach((item: any) => {
                    params = params.append(key.toString(), item);
                });
            } else if (query[key] instanceof Date) {
                params = params.append(key.toString(), query[key].toISOString());
            } else if (query[key].id) {
                params = params.append(key.toString(), query[key].id);
            } else {
                params = params.append(key.toString(), query[key]);
            }
        }
    }
    return params;
}

export function buildFilterParams(filters: any) {
    let result = filters;
    for (const key of Object.keys(result)) {
        if (result[key]) {
            if (result[key].hasOwnProperty('id')) {
                result[key] = result[key].id;
            }
            else if (result[key] instanceof Array) {
                let ids = _.map(result[key], (item) => parseId(item));
                _.remove(ids, (item) => item == null)
                result[key] = JSON.stringify(ids);
            }
        }
    }
    return result;
}

function parseId(item: any): any {
    if (item.hasOwnProperty('id')) {
        return item.id;
    } else if (!Number.isNaN(Number(item))) {
        return item;
    } else {
        return null;
    }
}

export function serialize(entity: any): any {
    // TODO: tratar de no repetir código.
    let result = entity;
    for (const key of Object.keys(result)) {
        if (result[key]) {
            if (result[key].hasOwnProperty('id')) {
                if(_.endsWith(key, 'Id')) {
                    result[key] = result[key].id;
                } else {
                    result[key + 'Id'] = result[key].id;
                    delete result[key];
                }
            }
            else if (result[key] instanceof Array) {
                let ids = _.map(result[key], (item) => parseId(item));
                _.remove(ids, (item) => item == null)
                result[key] = JSON.stringify(ids);
            }
        }
    }
    return result;
}

export function buildHeaderQueryType(tipoConsulta: string | null) {
    let headers = new HttpHeaders();
    return headers.append('X-Database', tipoConsulta ?? "Default");
}

export function appendHideHttpLoaderHeader(header: HttpHeaders) {
    return header.append('X-Hide-Http-Loader', 'true');
}
