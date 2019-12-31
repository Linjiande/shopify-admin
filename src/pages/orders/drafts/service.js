import axios from 'axios';

const apiBase = 'https://mirror.viralbox.org/linjd/admin/api/2019-10';
const account = { 'X-Shopify-Access-Token': 'f0685932b93ca0d6882374f86968a334' };
// 获取草稿订单列表
export async function getDraft_orders(params) {
  try {
    return await axios.get(`${apiBase}/draft_orders.json`, {
      headers: account,
      params,
    });
  } catch (error) {
    console.error(error);
  }
}
// 获取草稿详情
export async function getDraft_details(params) {
  console.log(params)
  try {
    return await axios.get(`${apiBase}/draft_orders/${params}.json`, {
      headers: account
    });
  } catch (error) {
    console.error(error);
  }
}
// 获取产品信息列表
export async function getProducts(params) {
  try {
    return await axios.get(`${apiBase}/products.json`, {
      headers: account,
      params,
    });
  } catch (error) {
    console.error(error);
  }
}
// 产品分页
export async function getRelProducts(url) {
  try {
    return await axios.get(`${apiBase}${url}`, {
      headers: account,
    });
  } catch (error) {
    console.error(error);
  }
}
// 获取客户信息列表
export async function getCustomers(params) {
  try {
    return await axios.get(`${apiBase}/customers.json`, {
      headers: account,
      params,
    });
  } catch (error) {
    console.error(error);
  }
}
// 搜索客户信息列表
export async function searchCustomers(params) {
  console.log('params',params)
  try {
    return await axios.get(`${apiBase}/customers/search.json`, {
      headers: account,
      params,
    });
  } catch (error) {
    console.error(error);
  }
}

// 创建订单
export async function createOrder(params) {
  try {
    return await axios.post(`${apiBase}/orders.json`, params, {
      headers: account,
    });
  } catch (error) {
    console.error(error);
  }
}
//创建草稿订单
export async function createDraft_orders(params) {
  try {
    return await axios.post(`${apiBase}/draft_orders.json`, params, {
      headers: account,
    });
  } catch (error) {
    console.error(error);
  }
}
