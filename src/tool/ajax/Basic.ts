import { forEach, isNil } from 'lodash'
import { Observable } from 'rxjs'
import { ajax, AjaxRequest, AjaxError } from 'rxjs/ajax'
import { throwError } from 'rxjs/internal/observable/throwError'
import { catchError, map } from 'rxjs/operators'

import { HttpMethod } from '@declare'

interface AjaxRequestWithUrl extends AjaxRequest {
  url: string
}

export class Ajax {
  protected host = ''

  protected headers: { [key: string]: string } = {}

  protected withCredentials = true

  constructor(headers: { [key: string]: string }) {
    this.setHeaders(headers)
  }

  getHost() {
    return this.host
  }

  setHost(host: string) {
    this.host = host
  }

  getHeaders() {
    return this.headers
  }

  setHeaders(headers: { [key: string]: string }) {
    this.headers = {
      ...this.headers,
      ...headers,
    }
  }

  getWithCredentials() {
    return this.withCredentials
  }

  setToken(token: string) {
    this.withCredentials = false
    this.setHeaders({ Authorization: `${token}` })
  }

  get<T>(url: string, query = {}, options: AjaxRequest = {}) {
    const uri = this.buildQuery(url, query)
    return this.ajax<T>({ method: HttpMethod.get, url: uri, ...options })
  }

  put<T>(url: string, body = {}, options: AjaxRequest = {}) {
    return this.ajax<T>({
      method: HttpMethod.put, url, body, ...options,
    })
  }

  post<T>(url: string, body = {}, options: AjaxRequest = {}) {
    return this.ajax<T>({
      method: HttpMethod.post, url, body, ...options,
    })
  }

  delete<T>(url: string, query = {}, options: AjaxRequest = {}) {
    const uri = this.buildQuery(url, query)
    return this.ajax<T>({ method: HttpMethod.delete, url: uri, ...options })
  }

  protected ajax<T>(options: AjaxRequestWithUrl): Observable<T> {
    return ajax({
      headers: this.headers,
      withCredentials: this.withCredentials,
      crossDomain: true,
      ...options,
      url: this.prefixApiHost(this.host, options.url),
    })
      .pipe(
        map((value) => {
          const resp: T = value.response
          return resp
        }),
        catchError((err: AjaxError) => throwError(err)),
      )
  }

  protected prefixApiHost(host: string, url: string) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    } if (host.endsWith('/') && url.startsWith('/')) {
      return `${host}${url.substr(1)}`
    } if (!host.endsWith('') && url.startsWith('/')) {
      return `${host}/${url}`
    }
    return `${host}${url}`
  }

  protected buildQuery(url: string, query?: object) {
    const param = new URLSearchParams()
    if (query) {
      forEach(query, (value, key) => {
        // eslint-disable-next-line no-unused-expressions
        isNil(value) || param.set(key, value)
      })
    }
    const queryString = param.toString()
    return queryString ? `${url}?${queryString}` : url
  }
}
