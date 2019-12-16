import { queryOrders,addOrder,updateOrder,getOrders,getCount,removeOrder } from '@/services/api'

const Model = {
  namespace: 'orders',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    count:0,
    header:"",
  },
  effects: {
    *getOrders({ payload }, { call, put }) {
      const response = yield call(getOrders, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          list: response.data.orders,
          pagination: {}
        },
      });
    },

    *getCount({ payload }, { call, put }) {
      const response = yield call(getCount, payload);
      yield put({
        type: 'count',
        payload: response.count,
      });
    },

    *remove({ payload, callback }, { call, put }) {
      yield call(removeOrder, payload);
      const response = yield call(getOrders, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data.orders,
          pagination: {}
        },
      });
      if (callback) callback();
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOrders, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.orders,
          pagination: {}
        },
      });
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addOrder, 'orders', payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },


    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateOrder, 'orders', payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    count(state, action) {
      return { ...state, count: action.payload };
    },
    header(state, action) {
      return { ...state, head: action.payload };
    },
  },
};
export default Model;
