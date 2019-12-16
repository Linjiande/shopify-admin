import { getOrders } from '@/services/api'

const Model = {
    namespace: 'order',
    state:{
        orders:[],
    },
    effects:{
        *fetch({ payload }, { call, put }) {
            const response = yield call(getOrders,payload);
            yield put({
                type: 'save',
                payload: {
                    orders:response.orders
                },
            });
            // console.log(response)
        },
    },
    reducers: {
        save(state, action) {
            let _state = JSON.parse(JSON.stringify(state))
            _state.orders = action.payload.orders
            // console.log('save_state',_state)
            return _state;
        },
    },
}
export default Model;