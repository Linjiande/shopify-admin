import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './index.less';

@connect(({ checkouts }) => ({
  checkouts,
}))
export default class index extends Component {
  columns = [
    {
      title: 'Checkout',
      dataIndex: 'name',
      filters: [
        {
          text: 'open',
          value: 'open',
        },
        {
          text: 'closed',
          value: 'closed',
        }
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
    },
    {
      title: 'Date',
      dataIndex: 'updated_at',
    },
    {
      title: 'Placed by',
      dataIndex: 'customer.first_name',
      render: (val, record) => (val ? `${val} ${record.customer.last_name}` : 'Unfulfilled'),
    },
    {
      title: 'Email Status',
      dataIndex: 'status',
      render: (val, record) => (val ? `${val} ${record.customer.last_name}` : 'Unfulfilled'),
    },
    // {
    //   title: 'Recovery Status',
    //   dataIndex: 'status',
    //   render: (val, record) => (val ? `${val} ${record.customer.last_name}` : 'Unfulfilled'),
    // },
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
      type: 'checkouts/getCheckouts',
    });
  };
  getCheckouts = (pagination, filters) => {
    const { dispatch } = this.props;
    filters.name.length === 0
      ? dispatch({
          type: 'checkouts/getCheckouts',
        })
      : dispatch({
          type: 'checkouts/getCheckouts',
          payload: {
            status: filters.name + '',
          },
        });
  };

  render() {
    const {
      checkouts: { checkouts },
    } = this.props;
    return (
      <div className={styles.container}>
        <div id="components-table-demo-head">
          <Table
            loading={!Boolean(checkouts.length)}
            columns={this.columns}
            dataSource={checkouts}
            onChange={this.getCheckouts}
          />
        </div>
      </div>
    );
  }
}
