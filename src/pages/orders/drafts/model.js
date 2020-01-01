import {
  getDraft_orders,
  deletesDraft_orders,
  getDraft_details,
  getProducts_images,
  getProducts,
  getRelProducts,
  getCustomers,
  searchCustomers,
  createOrder,
  createDraft_orders,
} from './service';
const Model = {
  namespace: 'drafts',
  state: {
    products: [],
    header: [],
    customers: [],
    draft_orders: [],
    checkouts: [],
    draft_order_drafts: {
      id: '',
      line_items: [],
      imags: [],
    },
  },

  effects: {
    // 获取草稿订单
    *getDraft_orders({ payload }, { call, put }) {
      yield put({ type: 'initialize' });
      const resDraft_orders = yield call(getDraft_orders, payload);
      yield put({ type: 'save', payload: resDraft_orders.data });
      resDraft_orders.headers.link
        ? yield put({ type: 'header', payload: resDraft_orders.headers.link.split(',') })
        : {};
    },
    // 获取草稿详情
    *getDraft_details({ payload }, { call, put }) {
      yield put({ type: 'initialize' });
      const resDraft_order = yield call(getDraft_details, payload);
      const line_items = resDraft_order.data.draft_order.line_items;
      // 获取产品图片
      const imags = [];
      for (let i = 0; i < line_items.length; i++) {
        let imag = yield call(getProducts_images, line_items[i].product_id);
        imags.push(imag.data.images[0].src);
      }
      yield put({
        type: 'save',
        payload: {
          draft_order_drafts: {
            id: resDraft_order.data.draft_order.id,
            line_items: resDraft_order.data.draft_order.line_items,
            imags,
          },
        },
      });
    },
    // 删除草稿
    *deletesDraft_orders({ payload }, { call, put }) {
      yield call(deletesDraft_orders, payload);
    },
    // 获取产品、分页
    *getProducts({ payload }, { call, put }) {
      const resProducts = yield call(getProducts, payload);
      yield put({ type: 'save', payload: resProducts.data });
      resProducts.headers.link
        ? yield put({ type: 'header', payload: resProducts.headers.link.split(',') })
        : {};
    },
    *getRelProducts({ payload }, { call, put, select }) {
      const products = yield select(({ drafts }) => drafts.products);
      const resProducts = yield call(getRelProducts, payload);
      yield put({
        type: 'save',
        payload: { products: [...products, ...resProducts.data.products] },
      });
      resProducts.headers.link
        ? yield put({ type: 'header', payload: resProducts.headers.link.split(',') })
        : {};
    },

    // 获取客户
    *getCustomers({ payload }, { call, put }) {
      const resCustomers = yield call(getCustomers, payload);
      yield put({ type: 'save', payload: resCustomers.data });
      resCustomers.headers.link
        ? yield put({ type: 'header', payload: resCustomers.headers.link.split(',') })
        : {};
    },
    // 搜索客户
    *searchCustomers({ payload }, { call, put }) {
      yield put({ type: 'initializeCustomers' });
      const resCustomers = yield call(searchCustomers, payload);
      yield put({ type: 'save', payload: resCustomers.data });
      resCustomers.headers.link
        ? yield put({ type: 'header', payload: resCustomers.headers.link.split(',') })
        : {};
    },

    // 创建订单
    *createOrder({ payload }, { call, put }) {
      yield call(createOrder, payload);
    },

    // 创建订单草稿
    *createDraft_orders({ payload }, { call, put }) {
      yield call(createDraft_orders, payload);
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    header(state, action) {
      return { ...state, header: action.payload };
    },
    initialize(state) {
      return {
        ...state,
        products: [],
        header: [],
        draft_orders: [],
        draft_order_drafts: { id: '', line_items: [], imags: [] },
      };
    },
    initializeCustomers(state) {
      return { ...state, customers: [], header: [] };
    },
  },
};
export default Model;
