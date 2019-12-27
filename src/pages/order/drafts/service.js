import axios from 'axios'

const apiBase = "https://mirror.viralbox.org/linjd/admin/api/2019-10"
const account = { 'X-Shopify-Access-Token': 'f0685932b93ca0d6882374f86968a334' }
// 获取产品信息列表
export async function getProducts(params) {
  let res;
  try {
    res = await axios.get(`${apiBase}/products.json?`, {
      headers: account,
      params,
    });
  } catch (error) {
    console.error(error);
  }
  return res;
}
// 获取客户信息列表
export async function getCustomers(params) {
  let res;
  try {
    res = await axios.get(`${apiBase}/customers.json`, {
      headers: account,
      params,
    });
  } catch (error) {
    console.error(error);
  }
  return res;
}
// 分页
export async function getRel(url) {
  let res;
  try {
    res = await axios.get(`${apiBase}${url}`, {
      headers: account,
    });
  } catch (error) {
    console.error(error);
  }
  return res;
}
// 创建订单
export async function createOrder(params) {
  let res;
  try {
    res = await axios.post(`${apiBase}/orders.json`,
      params,
      {
        headers: account
      });
  } catch (error) {
    console.error(error);
  }
  return res;
}