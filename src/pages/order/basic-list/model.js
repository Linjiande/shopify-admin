import { queryOrders,addOrder,updateOrder,removeOrder } from '@/services/api';
import { getCheckouts } from '@/services/api'

const Model = {
  namespace: 'checkouts',
  state: {
    list: [],
  },
  effects: {
    *getCheckouts({ payload }, { call, put }) {
      const response = yield call(getCheckouts, payload);
      yield put({
        type: 'list',
        payload: {
          list: response.checkouts,
        },
      });
    },
  //   *fetch({ payload }, { call, put }) {
  //     const response = yield call(queryOrders, payload);
  //     yield put({
  //       type: 'save',
  //       payload: {
  //         list: response.orders,
  //         pagination: {}
  //       },
  //     });
  //   },

  //   *add({ payload, callback }, { call, put }) {
  //     const response = yield call(addOrder, 'orders', payload);
  //     yield put({
  //       type: 'save',
  //       payload: response,
  //     });
  //     if (callback) callback();
  //   },

  //   *remove({ payload, callback }, { call, put }) {
  //     const response = yield call(removeOrder, 'orders', payload);
  //     yield put({
  //       type: 'save',
  //       payload: response,
  //     });
  //     if (callback) callback();
  //   },

  //   *update({ payload, callback }, { call, put }) {
  //     const response = yield call(updateOrder, 'orders', payload);
  //     yield put({
  //       type: 'save',
  //       payload: response,
  //     });
  //     if (callback) callback();
  //   },
  },
  reducers: {
    list(state, action) {
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
