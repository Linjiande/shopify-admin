import request from '@/utils/request';

export async function getCheckouts(params) {
  return request('https://mirror.viralbox.org/linjd/admin/api/2019-10/checkouts.json', {
      method: 'GET',
      params,
  });
}
