import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './index.less';

@connect(({ drafts }) => ({
  drafts,
}))
export default class table extends Component {
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
    const { dispatch } = this.props;
    dispatch({
      type: 'drafts/getDraft_orders'
    });
  };
  getDraft_orders = (pagination, filters) => {
    console.log(filters);
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
          />
        </div>
      </div>
    );
  }
}
