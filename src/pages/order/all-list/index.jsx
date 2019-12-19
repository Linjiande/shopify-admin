import {
  Tag,
  Button,
  Card,
  Col,
  DatePicker,
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
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';
import { black } from 'color-name';
import NavLink from 'umi/navlink';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


/* eslint react/no-multi-comp:0 */
@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    currentPage:1,
    params:{limit:10}
  };

  columns = [
    {
      title: 'Order',
      dataIndex: 'order_number',
      render: (val) => `#${val}`
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title:'Customer',
      dataIndex:'customer.first_name',
      render: (val, record) => val ?  `${val} ${record.customer.last_name}` : 'Unfulfilled',
    },
    {
      title:'Payment',
      dataIndex:'financial_status',
      render:val => <Tag color="orange">{val}</Tag>,
    },
    {
      title:'Fulfillment',
      dataIndex:'fulfillment_status',
      render: (val) => val ? <Tag color="volcano">{val}</Tag> : <Tag color="gold">{'Unfulfilled'}</Tag>,
    },
    {
      title:'Total',
      dataIndex:'total_price',
      render: (val, record) => currencyFormatter.format(val, {code: record.currency}),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/getOrders',
      payload:{
        limit:10
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, orders: { header }  } = this.props;
    const { formValues,currentPage } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      let temp = sorter.order;
      let sort = "";
      if(temp==="ascend"){
        sort = temp.substr(0,3);
      }else if(temp==="descend"){
        sort = temp.substr(0,4);
      }
      params.order = `${sorter.field} ${sort}`;
    }
    this.setState({
      currentPage:pagination.current,
      params
    })
    if(pagination.current!==1) {
      const regexp = /<(.+)>[;]\srel="([a-z]+)"/
      header.forEach(element => {
        // exec是正则的方法、match是字符串的方法
        const urlrel = regexp.exec(element);
        const url =  urlrel[1].replace(/.+2019-10/,"");
        const rel =  urlrel[2];
        params.url = url;
        if((currentPage<pagination.current&&rel==="next")||
            (currentPage>pagination.current&&rel==="previous")) {
          dispatch({
            type:"orders/getRel",
            payload:params
          })
        }
      })
    }else{
      dispatch({
      type: 'orders/getOrders',
      payload: params,
    });}
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'orders/getOrders',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'orders/removeOrder',
          payload: selectedRows.map(row => row.id),
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;

      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { params,currentPage   } = this.state
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...params,
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        currentPage: 1,
        formValues: values,
      });
      dispatch({
        type: 'orders/filtration',
        payload: values,
      });
    });
  };

  // handleModalVisible = flag => {
  //   this.setState({
  //     modalVisible: !!flag,
  //   });
  // };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单进度">
              {getFieldDecorator('financial_status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="pending">未完成订单-pending</Option>
                  <Option value="paid">已付款订单-paid</Option>
                  <Option value="refunded">退款订单-refunded</Option>
                  <Option value="voided">无效订单-voided</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
              {/* <a
                style={{
                  marginLeft: 8,
                }}
                onClick={this.toggleForm}
              >
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // renderAdvancedForm() {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row
  //         gutter={{
  //           md: 8,
  //           lg: 24,
  //           xl: 48,
  //         }}
  //       >
  //         <Col md={8} sm={24}>
  //           <FormItem label="订单号">
  //             {getFieldDecorator('name')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="付款进度">
  //             {getFieldDecorator('status')(
  //               <Select
  //                 placeholder="请选择"
  //                 style={{
  //                   width: '100%',
  //                 }}
  //               >
  //                 <Option value="0">未付款</Option>
  //                 <Option value="1">已付款</Option>
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="调用次数">
  //             {getFieldDecorator('number')(
  //               <InputNumber
  //                 style={{
  //                   width: '100%',
  //                 }}
  //               />,
  //             )}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <Row
  //         gutter={{
  //           md: 8,
  //           lg: 24,
  //           xl: 48,
  //         }}
  //       >
  //         <Col md={8} sm={24}>
  //           <FormItem label="更新日期">
  //             {getFieldDecorator('date')(
  //               <DatePicker
  //                 style={{
  //                   width: '100%',
  //                 }}
  //                 placeholder="请输入更新日期"
  //               />,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="使用状态">
  //             {getFieldDecorator('status3')(
  //               <Select
  //                 placeholder="请选择"
  //                 style={{
  //                   width: '100%',
  //                 }}
  //               >
  //                 <Option value="0">关闭</Option>
  //                 <Option value="1">运行中</Option>
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="使用状态">
  //             {getFieldDecorator('status4')(
  //               <Select
  //                 placeholder="请选择"
  //                 style={{
  //                   width: '100%',
  //                 }}
  //               >
  //                 <Option value="0">关闭</Option>
  //                 <Option value="1">运行中</Option>
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <div
  //         style={{
  //           overflow: 'hidden',
  //         }}
  //       >
  //         <div
  //           style={{
  //             float: 'right',
  //             marginBottom: 24,
  //           }}
  //         >
  //           <Button type="primary" htmlType="submit">
  //             查询
  //           </Button>
  //           <Button
  //             style={{
  //               marginLeft: 8,
  //             }}
  //             onClick={this.handleFormReset}
  //           >
  //             重置
  //           </Button>
  //           <a
  //             style={{
  //               marginLeft: 8,
  //             }}
  //             onClick={this.toggleForm}
  //           >
  //             收起 <Icon type="up" />
  //           </a>
  //         </div>
  //       </div>
  //     </Form>
  //   );
  // }

  // renderForm() {
  //   const { expandForm } = this.state;
  //   return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  // }

  
  render() {
    const {
      orders: { list,count },
      loading,
    } = this.props;
    // console.log("orders",this.props.orders)
    // console.log("loading",loading)
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, currentPage } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              </Button> */}
              <Button type="primary"><NavLink to="/drafts_orders/new">新建订单</NavLink></Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={{list}}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              pagination={{simple: true, total: count,current: currentPage}}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
