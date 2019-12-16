import {
    Badge,
    Button,
    Card,
    Table,
    Col,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Icon,
    Input,
    InputNumber,
    Menu,
    Row,
    Select,
    message,
  } from 'antd';
import React, {Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

// 第一个参数传递model的namespace，将会返回对应的state
@connect(({ order, }) => ({
    orders:order
  }))
class index extends Component {
    state = { test:1 }
    columns = [
        {
          title: 'Order',
          dataIndex: 'order_number',
          render: (val) => `${val}`
        },
        {
          title: 'Date',
          dataIndex: 'created_at',
          // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
          title:'Customer',
          dataIndex:'customer.first_name',
          // render: (val, record) => `${val} ${record.customer.last_name}`,
        },
        {
          title:'Payment',
          dataIndex:'financial_status',
        },
        {
          title:'Fulfillment',
          dataIndex:'fulfillment_status',
          sorter: true,
          render: (val) => val ? val : 'Unfulfilled',
        },
        {
          title:'Total',
          dataIndex:'total_price',
          sorter: true,
          // render: (val, record) => currencyFormatter.format(val, {code: record.currency}),
        },
    ];
    componentDidMount(){
        // getOrders().then(res => {
        //     console.log(res)
        // });

        // console.log(this.props)
        const { dispatch } = this.props;
        dispatch({
            type: 'order/fetch',
        })
    }
    // hanldOnClick = () => {
    //   let  t  = this.state.test
    //     t = 2
    //   this.setState({test:t})
    //   console.log('hanldOnClick',this.state)
    // }
    render() {
        const { orders:{orders} } = this.props
        // console.log(orders)
        return (
            <PageHeaderWrapper>
                <Card>
                    <Table bordered={true} columns={this.columns} dataSource={orders}/>
                </Card>
                <Card>
                  {/* {function test (){
                    let nowdate =new Date(Date.now());
                    let date=Date.parse(nowdate)
                    return <div>{date}</div>
                  }()} */}
                  {/* <button onClick={this.hanldOnClick}>test</button> */}
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default index;