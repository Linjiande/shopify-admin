import request from '@/utils/request';
import { stringify } from 'qs';

/**
 * Resource的查询接口
 */
export async function query(resource, params, apiBase = '/api') {
  return request(`${apiBase}/${resource}?${stringify(params)}`);
}

/**
 * Resource的添加接口
 */
export async function add(resource, params, apiBase = '/api') {
  return request(`${apiBase}/${resource}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * Resource的更新接口
 */
export async function update(resource, id, params, apiBase = '/api') {
  return request(`${apiBase}/${resource}/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

/**
 * Resource的添加接口
 * @remark 如何支持批量删除?
 */
export async function del(resource, id, apiBase = '/api') {
  return request(`${apiBase}/${resource}/${id}`, {
    method: 'DELETE',
  });
}

