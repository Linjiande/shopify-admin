import axios from 'axios'

const apiBase = "https://mirror.viralbox.org/linjd/admin/api/2019-10"
const account = {'X-Shopify-Access-Token':'f0685932b93ca0d6882374f86968a334'}
export async function getOrders(params) {
  let res;
  try {
    res = await axios.get(`${apiBase}/orders.json?`,{
      headers: account,
      params,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
  return res;
}

export async function removeOrder(params) {
  let res;
  try {
    res = await axios.delete(`${apiBase}/orders/${params}.json?`,{
      headers: account,
    });
  } catch (error) {
    console.error(error);
  }
  return res;
}

export async function getCount(params) {
  let res;
  try {
    res = await axios.get(`${apiBase}/orders/count.json?`,{
      headers: account,
      params
    });
  } catch (error) {
    console.error(error);
  }
  return res;
}

export async function getRel(params) {
  let res;
  try {
    res = await axios.get(`${apiBase}${params.url}`,{
      headers: account,
    });
  } catch (error) {
    console.error(error);
  }
  return res;
}
