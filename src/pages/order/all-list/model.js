import { 
  getOrders,
  getCount,
  removeOrder,
  getRel,
} from './service'

const Model = {
  namespace: 'orders',
  state: {
    list: [],
    count:0,
    header:"",
  },

  effects: {
    *getOrders({ payload }, { call, put }) {
      const resOrders = yield call(getOrders, payload);
      const resCount = yield call(getCount, payload);
      yield put({type: 'list', payload: resOrders.data.orders});
      yield put({type: 'count', payload: resCount.data.count});
      resOrders.headers.link?yield put({type: 'header', payload: resOrders.headers.link.split(",")}):{};
    },
    
    *filtration({ payload }, { call, put }) {
      const resOrders = yield call(getOrders, payload);
      const resCount = yield call(getCount, payload);
      yield put({type: 'list', payload: resOrders.data.orders});
      yield put({type: 'count', payload: resCount.data.count});
      resOrders.headers.link?yield put({type: 'header', payload: resOrders.headers.link.split(",")}):{};

    },

    *getRel({ payload }, { call, put }) {
      const resOrders = yield call(getRel, payload);
      yield put({type: 'list', payload: resOrders.data.orders});
      resOrders.headers.link?yield put({type: 'header', payload: resOrders.headers.link.split(",")}):{};
    },

    *removeOrder({ payload, callback }, { call, put }) {
      yield call(removeOrder, payload);
      const resOrders = yield call(getOrders, payload);
      const resCount = yield call(getCount, payload);
      yield put({type: 'list', payload: resOrders.data.orders});
      yield put({type: 'count', payload: resCount.data.count});
      resOrders.headers.link?yield put({type: 'header', payload: resOrders.headers.link.split(",")}):{};
      if (callback) callback();
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
  //     const response = yield call(addOrder, payload);
  //     yield put({
  //       type: 'save',
  //       payload: response,
  //     });
  //     if (callback) callback();
  //   },


  //   *update({ payload, callback }, { call, put }) {
  //     const response = yield call(updateOrder, payload);
  //     yield put({
  //       type: 'save',
  //       payload: response,
  //     });
  //     if (callback) callback();
  //   },
  },
  reducers: {
    list(state, action) {
      return { ...state, list: action.payload};
    },
    count(state, action) {
      return { ...state, count: action.payload};
    },
    header(state, action) {
      return { ...state, header: action.payload};
    },
  }
};
export default Model;
