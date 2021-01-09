import { Ajax } from '@tool'

const httpHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const basicAjax = new Ajax(httpHeader)
