import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import router from 'umi/router';
import styles from './index.less';

@connect(({ drafts }) => ({
  drafts,
}))
export default class index extends Component {
  columns = [
    {
      title: 'Draft',
      dataIndex: 'name',
      filters: [
        {
          text: 'open',
          value: 'open',
        },
        {
          text: 'invoice_sent',
          value: 'invoice_sent',
        },
        {
          text: 'completed',
          value: 'completed',
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
    },
    {
      title: 'Date',
      dataIndex: 'updated_at',
    },
    {
      title: 'Customer',
      dataIndex: 'customer.first_name',
      render: (val, record) => (val ? `${val} ${record.customer.last_name}` : 'Unfulfilled'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Total',
      dataIndex: 'total_price',
      align: 'right',
      filterMultiple: false,
    },
  ];
  componentDidMount = () => {
    console.log(this.props)
    const { dispatch } = this.props;
    dispatch({
      type: 'drafts/getDraft_orders',
    });
  };
  getDraft_orders = (pagination, filters) => {
    const { dispatch } = this.props;
    filters.name.length === 0
      ? dispatch({
          type: 'drafts/getDraft_orders',
        })
      : dispatch({
          type: 'drafts/getDraft_orders',
          payload: {
            status: filters.name + '',
          },
        });
  };
  onRow = record => {
    const {
      dispatch,
      drafts: { draft_order },
    } = this.props;
    return {
      onClick: () => {
        console.log(record);
        dispatch({
          type: 'drafts/getDraft_details',
          payload: record.id,
        });
        this.intervalID = setInterval(() => {
          if (draft_order.length !== 0) {
            router.push(`/orders/drafts_orders/${record.id}`);
          }
        }, 500);
      },
    };
  };
  componentWillUnmount = () => {
    clearInterval(this.intervalID)
  }
  render() {
    const {
      drafts: { draft_orders },
    } = this.props;
    return (
      <div className={styles.container}>
        <div id="components-table-demo-head">
          <Table
            loading={!Boolean(draft_orders.length)}
            columns={this.columns}
            dataSource={draft_orders}
            onChange={this.getDraft_orders}
            onRow={this.onRow}
          />
        </div>
      </div>
    );
  }
}
