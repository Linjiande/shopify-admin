import axios from 'axios';

const apiBase = 'https://mirror.viralbox.org/linjd/admin/api/2019-10';
const account = { 'X-Shopify-Access-Token': 'f0685932b93ca0d6882374f86968a334' };

// 获取弃单列表
export async function getCheckouts(params) {
  try {
    return await axios.get(`${apiBase}/checkouts.json`, {
      headers: account,
      params,
    });
  } catch (error) {
    console.error(error);
  }
}