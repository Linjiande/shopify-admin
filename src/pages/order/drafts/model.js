import {
    getProducts,
    getCustomers,
    getRel,
    createOrder,
} from './service'
const Model = {
    namespace: 'drafts',
    state: {
        products: [],
        customers: [],
        header: [],
    },

    effects: {
        *getProducts({ payload }, { call, put }) {
            const resProducts = yield call(getProducts, payload);
            yield put({ type: 'save', payload: resProducts.data });
            resProducts.headers.link ? yield put({ type: 'header', payload: resProducts.headers.link.split(",") }) : {};
        },
        *getCustomers({ payload }, { call, put }) {
            const resCustomers = yield call(getCustomers, payload);
            yield put({ type: 'save', payload: resCustomers.data });
            resCustomers.headers.link ? yield put({ type: 'header', payload: resCustomers.headers.link.split(",") }) : {};
        },
        *getRel({ payload }, { call, put, select }) {
            const products = yield select(({ drafts }) => drafts.products)
            const resProducts = yield call(getRel, payload);
            yield put({ type: 'save', payload: { products: [...products, ...resProducts.data.products] } });
            resProducts.headers.link ? yield put({ type: 'header', payload: resProducts.headers.link.split(",") }) : {};
        },
        *createOrder({ payload }, { call, put }) {
            console.log('model',payload)
            yield call(createOrder, payload);
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
            return { ...state, products: [], header: [] };
        },
    }
}
export default Model;