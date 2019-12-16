import request from '@/utils/request';
import { query, add, update, del } from './rest'

export async function getOrders(params) {
    return request('https://mirror.viralbox.org/linjd/admin/api/2019-10/orders.json?status=any', {
        method: 'GET',
        params,
        getResponse: true,
    });
}
export async function getCount() {
    return request('https://mirror.viralbox.org/linjd/admin/api/2019-10/orders/count.json?status=any', {
        method: 'GET',
    });
}
export async function removeOrder(params) {
    console.log(params)
    return request(`https://mirror.viralbox.org/linjd/admin/api/2019-10/orders/${params}.json?`, {
        method: 'DELETE',
    });
}
export async function getCheckouts(params) {
    return request('https://mirror.viralbox.org/linjd/admin/api/2019-10/checkouts.json', {
        method: 'GET',
        params,
    });
}

// https://mirror.viralbox.org/linjd/admin/api/2019-10/orders.json
const apiBase = `/admin/api/2019-10`

export const queryOrders = (params) => query('orders.json', params, apiBase)
export const addOrder = (params) => add('orders.json', params, apiBase)
export const updateOrder = (id, params) => update('orders.json', id, params, apiBase)
export const delOrder = (id, params) => del('orders.json', id, params, apiBase)
