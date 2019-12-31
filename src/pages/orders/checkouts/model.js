import { getCheckouts } from './service';
const Model = {
  namespace: 'checkouts',
  state: {
    checkouts: [],
    header: [],
  },
  // 获取弃单
  *getCheckouts({ payload }, { call, put }) {
    console.log("runrun")
    const resCheckouts = yield call(getCheckouts, payload);
    yield put({ type: 'save', payload: resCheckouts.data });
    resCheckouts.headers.link
      ? yield put({ type: 'header', payload: resCheckouts.headers.link.split(',') })
      : {};
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
