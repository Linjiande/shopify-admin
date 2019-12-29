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
  // InputNumber,
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
// import { black } from 'color-name';
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
class index extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    currentPage: 1,
    params: { limit: 10 },
  };

  columns = [
    {
      title: 'Order',
      dataIndex: 'order_number',
      render: val => `#${val}`,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer.first_name',
      render: (val, record) => (val ? `${val} ${record.customer.last_name}` : 'Unfulfilled'),
    },
    {
      title: 'Payment',
      dataIndex: 'financial_status',
      render: val => <Tag color="orange">{val}</Tag>,
    },
    {
      title: 'Fulfillment',
      dataIndex: 'fulfillment_status',
      render: val =>
        val ? <Tag color="volcano">{val}</Tag> : <Tag color="gold">{'Unfulfilled'}</Tag>,
    },
    {
      title: 'Total',
      dataIndex: 'total_price',
      render: (val, record) => currencyFormatter.format(val, { code: record.currency }),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/getOrders',
      payload: {
        limit: 10,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {
      dispatch,
      orders: { header },
    } = this.props;
    const { formValues, currentPage } = this.state;
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
      let sort = '';
      if (temp === 'ascend') {
        sort = temp.substr(0, 3);
      } else if (temp === 'descend') {
        sort = temp.substr(0, 4);
      }
      params.order = `${sorter.field} ${sort}`;
    }
    this.setState({
      currentPage: pagination.current,
      params,
    });
    if (pagination.current !== 1) {
      const regexp = /<(.+)>[;]\srel="([a-z]+)"/;
      header.forEach(element => {
        // exec是正则的方法、match是字符串的方法
        const urlrel = regexp.exec(element);
        const url = urlrel[1].replace(/.+2019-10/, '');
        const rel = urlrel[2];
        params.url = url;
        if (
          (currentPage < pagination.current && rel === 'next') ||
          (currentPage > pagination.current && rel === 'previous')
        ) {
          dispatch({
            type: 'orders/getRel',
            payload: params,
          });
        }
      });
    } else {
      dispatch({
        type: 'orders/getOrders',
        payload: params,
      });
    }
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
    const { params } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...params,
        ...fieldsValue,
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      //添加financial_status数组，并转为字符串
      if (fieldsValue.financial_status !== undefined) {
        values.financial_status = fieldsValue.financial_status + '';
        if (fieldsValue.financial_status.length === 0) {
          values.financial_status = undefined;
        }
      }
      //添加financial_status数组，并转为字符串
      if (fieldsValue.fulfillment_status !== undefined) {
        values.fulfillment_status = fieldsValue.fulfillment_status + '';
        if (fieldsValue.fulfillment_status.length === 0) {
          values.fulfillment_status = undefined;
        }
      }
      // console.log(fieldsValue.created_at_min.format("YYYY-MM-DDThh:mm:ss+8:00"))
      // 添加created_at_min数组，并转为字符串
      if (fieldsValue.created_at_min !== undefined) {
        values.created_at_min = fieldsValue.created_at_min.format('YYYY-MM-DD');
        if (fieldsValue.created_at_min.length === 0) {
          values.created_at_min = undefined;
        }
      }
      // console.log(values)
      this.setState({
        currentPage: 1,
        formValues: values,
      });
      dispatch({
        type: 'orders/getOrders',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

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
      <Form onSubmit={this.handleSearch} layout="vertical">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="order">
              {getFieldDecorator('name')(<Input placeholder="请输入order" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="status">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择(单选)"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="closed">closed</Option>
                  <Option value="cancelled">cancelled</Option>
                  <Option value="any">any</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="financial_status">
              {getFieldDecorator('financial_status')(
                <Select
                  mode="tags"
                  placeholder="请选择(可多选)"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="pending">pending</Option>
                  <Option value="paid">paid</Option>
                  <Option value="refunded">refunded</Option>
                  <Option value="voided">voided</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="fulfillment_status">
              {getFieldDecorator('fulfillment_status')(
                <Select
                  mode="tags"
                  placeholder="请选择(可多选)"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="shipped">shipped</Option>
                  <Option value="partial">partial</Option>
                  <Option value="unshipped">unshipped</Option>
                  <Option value="unfulfilled">unfulfilled</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="created_at">
              {getFieldDecorator('created_at_min')(
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入创建日期"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" icon="search" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 16 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button type="primary" style={{ marginLeft: 32 }}>
                <NavLink to="/orders/drafts_orders/new">创建订单</NavLink>
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      orders: { list, count },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      currentPage,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
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
              {selectedRows.length > 0 && (
                <span>
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
              data={{ list }}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              pagination={{ simple: true, total: count, current: currentPage }}
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

export default Form.create()(index);
