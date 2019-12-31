import {
  Card,
  Icon,
  Button,
  Row,
  Col,
  Input,
  Modal,
  List,
  InputNumber,
  Spin,
  Select,
  message,
  Checkbox,
  Avatar,
  Alert,
} from 'antd';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavLink from 'umi/navlink';

@connect(({ drafts }) => ({
  drafts,
}))
class index extends Component {
  state = {
    data: ['All products', 'Product types', 'Vendors'],
    value: {
      product: '',
      notes: undefined,
      customerName: undefined,
      email: undefined,
    },
    visible: {
      product: false,
      email: false,
    },
    conceal: true,
    loading: false,
    hasMore: true,
    regexp: false,
    checkbox: [],
    checkedbox: [],
    line_items: [],
    customer: {},
  };

  componentDidMount() {
    const {
      drafts: { draft_order },
    } = this.props;
    console.log('componentDidMount', draft_order.line_items);
    // this.setState({

    // })
  }

  // product和notes,改变输入框
  handleChange = e => {
    const { value } = this.state;
    switch (e.target.id) {
      case 'product':
        this.setState({
          value: {
            ...value,
            product: e.target.value,
          },
        });
        break;
      case 'notes':
        this.setState({
          value: {
            ...value,
            notes: e.target.value,
          },
        });
        break;
      case 'email':
        this.setState({
          value: {
            ...value,
            email: e.target.value,
          },
        });
        break;
      default:
        console.log(e.target.id);
    }
  };
  // Customer,改变输入框,搜索框的值
  searchCustomer = e => {
    const { dispatch } = this.props;
    const { value } = this.state;
    this.setState({
      value: {
        ...value,
        customerName: e,
      },
    });
    dispatch({
      type: 'drafts/searchCustomers',
      payload: { query: e },
    });
  };
  resetSelect = () => {
    const { value } = this.state;
    this.setState({
      value: {
        ...value,
        customerName: undefined,
      },
    });
  };

  // products对话框Modal显示状态的控制
  showModal = e => {
    const {
      value: { product },
      visible,
    } = this.state;
    switch (e) {
      case 'product':
        visible.product = true;
        break;
      case 'email':
        visible.email = true;
        break;
      default:
        console.log(e);
    }
    this.setState({
      visible,
      loading: false,
    });
    if (product.length > 0) {
      this.getProducts(product);
    }
  };
  // 对话框Modal的取消Cancel按钮
  Cancel = e => {
    const { dispatch } = this.props;
    const { visible } = this.state;
    switch (e) {
      case 'product':
        dispatch({
          type: 'drafts/initialize',
        });
        visible.product = false;
        break;
      case 'email':
        visible.email = false;
        break;
      default:
        console.log(e);
    }
    this.setState({
      visible,
      checkbox: [],
    });
  };
  // products对话框Modal的确定onOkAddToOrder按钮
  onOkAddToOrder = async () => {
    const { checkbox, checkedbox, line_items, visible } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'drafts/initialize',
    });
    checkbox.forEach(item => {
      item = JSON.parse(item);
      for (let i = 0; i < checkedbox.length; i++) {
        checkedbox[i] = JSON.parse(checkedbox[i]);
        if (checkedbox[i].variant_id === item.variant_id) {
          checkedbox.splice(i, 1);
          break;
        }
        checkedbox[i] = JSON.stringify(checkedbox[i]);
      }
    });
    await this.setState({
      visible: { ...visible, product: false },
      checkedbox: [...checkedbox, ...checkbox],
      checkbox: [],
    });
    this.state.checkedbox.forEach(item => {
      item = JSON.parse(item);
      line_items.forEach((line, index) => {
        line = JSON.parse(line);
        if (line.variant_id === item.variant_id) {
          line_items.splice(index, 1);
        }
        line = JSON.stringify(line);
      });
      line_items.push(
        JSON.stringify({
          variant_id: item.variant_id,
          quantity: 1,
          prices: Number(item.price),
        }),
      );
      item = JSON.stringify(item);
    });
    this.setState({
      line_items,
    });
  };
  // email对话框Modal的确定onOkApply按钮
  onOkApply = async () => {
    const {
      visible,
      value: { email },
    } = this.state;
    const regexp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (regexp.test(email)) {
      this.setState({
        visible: {
          ...visible,
          email: false,
          regexp: false,
        },
      });
    } else {
      this.setState({
        regexp: true,
      });
    }
  };
  //Customer模块的卡片Card显示控制
  showCustomerInfo = id => {
    const {
      drafts: { customers },
    } = this.props;
    const { value } = this.state;
    this.setState({
      conceal: false,
    });
    customers.map(item => {
      if (item.id === id) {
        this.setState({
          customer: item,
          value: {
            ...value,
            email: item.email,
          },
        });
      }
    });
  };
  //Customer模块的卡片Card显示控制
  closeCustomerInfo = () => {
    this.setState({
      conceal: true,
      customer: {},
    });
  };

  // 商品选择
  checkboxChange = e => {
    let { checkbox } = this.state;
    const value = JSON.stringify(e.target.value);
    const index = checkbox.indexOf(value);
    if (e.target.checked === true && index === -1) {
      this.setState({
        checkbox: [...checkbox, value],
      });
    } else if (e.target.checked === false && index !== -1) {
      checkbox.splice(index, 1);
      this.setState({
        checkbox,
      });
    }
  };
  // 获取商品列表的无线下拉加载
  handleInfiniteOnLoad = () => {
    const {
      dispatch,
      drafts: { header },
    } = this.props;
    const temp = [];
    let url = '';
    this.setState({
      loading: false,
    });
    const regexp = /<(.+)>[;]\srel="([a-z]+)"/;
    header.forEach(element => {
      // exec是正则的方法、match是字符串的方法,
      // 各自优点：exec信息详细，match方便
      const urlrel = regexp.exec(element);
      url = urlrel[1].replace(/.+2019-10/, '');
      const rel = urlrel[2];
      temp.push(rel);
    });
    if (temp.length === 1 && temp[0] === 'previous') {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
      });
      return;
    }
    if ((temp.length === 1 && temp[0] === 'next') || (temp.length === 2 && temp[1] === 'next')) {
      dispatch({
        type: 'drafts/getRelProducts',
        payload: url,
      });
      this.setState({
        loading: true,
      });
    }
  };

  // 改变订单对应商品的数量
  quantityChange = (variant_id, value, price) => {
    let { line_items } = this.state;
    // 根据id修改订单orders中对应商品id对应的数量quantity
    for (let i = 0; i < line_items.length; i++) {
      line_items[i] = JSON.parse(line_items[i]);
      if (line_items[i].variant_id === variant_id) {
        line_items.splice(
          i,
          1,
          JSON.stringify({
            variant_id,
            quantity: value,
            prices: Number(price) * value.toFixed(2),
          }),
        );
        break;
      }
      line_items[i] = JSON.stringify(line_items[i]);
    }
    this.setState({
      line_items,
    });
  };
  // 删除选中的商品
  deleteProduct = e => {
    let { checkedbox, line_items } = this.state;
    // json对象转换成字符串，查询匹配得到对应索引index，反之索引index为-1
    const item = JSON.stringify(e);
    index = checkedbox.indexOf(item);
    checkedbox.splice(index, 1);
    // 根据variant_id删除数组中对应的line_items元素
    for (let i = 0; i < line_items.length; i++) {
      line_items[i] = JSON.parse(line_items[i]);
      if (line_items[i].variant_id === e.variant_id) {
        line_items.splice(i, 1);
        break;
      }
      line_items[i] = JSON.stringify(line_items[i]);
    }

    this.setState({
      checkedbox,
      line_items,
    });
  };

  // 计算商品列表(选中的全部商品)总价格
  shoppingCartPrices = () => {
    const { line_items } = this.state;
    let price = 0;
    return line_items.length !== 0 ? (
      line_items.map((line, index) => {
        line = JSON.parse(line);
        price += line.prices;
        line = JSON.stringify(line);
        if (index === line_items.length - 1) {
          return <span>{price}</span>;
        }
      })
    ) : (
      <span>¥0.00</span>
    );
  };

  // 获取商品信息列表
  getProducts = async param => {
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    switch (param) {
      case 'All products':
      case 'Product types':
      case 'Vendors':
        await dispatch({
          type: 'drafts/getProducts',
          payload: { limit: 5 },
        });
        break;
      default:
        await dispatch({
          type: 'drafts/getProducts',
          payload: { limit: 5 },
        });
        console.log(param);
    }
    this.setState({
      loading: false,
    });
  };
  // 获取顾客信息列表
  getCustomer = () => {
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'drafts/getCustomers',
    });
  };
  // 创建订单
  createOrder = financial_status => {
    const { dispatch } = this.props;
    const {
      line_items,
      value: { notes, email },
      customer: { id },
    } = this.state;
    const temp = [];
    line_items.forEach(line => {
      line = JSON.parse(line);
      temp.push(line);
    });
    const order1 = {
      order: {
        line_items: temp,
        notes,
        email,
        financial_status,
      },
    };
    const order2 = {
      order: {
        line_items: temp,
        notes,
        email,
        customer: { id: id },
        financial_status,
      },
    };
    id === undefined
      ? dispatch({
          type: 'drafts/createOrder',
          payload: order1,
        })
      : dispatch({
          type: 'drafts/createOrder',
          payload: order2,
        });
  };
  // 创建订单草稿
  createDraft_orders = () => {
    const { dispatch } = this.props;
    const {
      line_items,
      value: { notes, email },
      customer: { id },
    } = this.state;
    const temp = [];
    line_items.forEach(line => {
      line = JSON.parse(line);
      temp.push(line);
    });
    const draft_orders1 = {
      draft_order: {
        line_items: temp,
        notes,
        email,
      },
    };
    const draft_orders2 = {
      draft_order: {
        line_items: temp,
        notes,
        email,
        customer: { id: id },
      },
    };
    id === undefined
      ? dispatch({
          type: 'drafts/createDraft_orders',
          payload: draft_orders1,
        })
      : dispatch({
          type: 'drafts/createDraft_orders',
          payload: draft_orders2,
        });
  };

  render() {
    const { Search, TextArea } = Input;
    const { Option } = Select;
    const {
      drafts: { products, customers, draft_order },
    } = this.props;
    const {
      visible,
      conceal,
      value,
      data,
      checkedbox,
      loading,
      hasMore,
      line_items,
      customer,
      regexp,
    } = this.state;
    // this.props.drafts.draft_order.line_items
    console.log(draft_order.line_items);
    return (
      <PageHeaderWrapper
        title={
          <NavLink to="/orders/all_list" style={{ color: '#000000' }}>
            <Icon type="left" style={{ fontSize: 15, marginRight: 5 }} />
            order
          </NavLink>
        }
      >
        <Row type="flex" justify="space-around" gutter={[16, 16]}>
          <Col lg={{ span: 16 }}>
            <Card>
              <Card bordered={false}>
                <h2>Order details</h2>
                <Search
                  id="product"
                  placeholder="Search products"
                  enterButton="Browse products"
                  size="large"
                  value={value.product}
                  onChange={this.handleChange}
                  onSearch={() => this.showModal('product')}
                />
              </Card>
              {checkedbox.length !== 0 &&
                checkedbox.map((item, key) => {
                  item = JSON.parse(item);
                  return (
                    <Card bordered={false} key={key}>
                      <Row type="flex" justify="space-around" align="middle" gutter={[16, 16]}>
                        <Col lg={{ span: 3 }}>
                          <img src={item.image} style={{ width: '70px', height: '70px' }} />
                        </Col>
                        <Col lg={{ span: 10 }} style={{ textAlign: 'center' }}>
                          <a>{item.productTitle}</a>
                          <div>{item.variantTitle}</div>
                          <div>{item.sku}</div>
                        </Col>
                        <Col lg={{ span: 10, push: 1 }}>
                          {item.price} &nbsp; x &nbsp;
                          <InputNumber
                            min={1}
                            max={100}
                            defaultValue={1}
                            onChange={value =>
                              this.quantityChange(item.variant_id, value, item.price)
                            }
                          />{' '}
                          &nbsp; ¥ &nbsp;
                          {line_items.map(line => {
                            line = JSON.parse(line);
                            const price = line.prices;
                            if (line.variant_id === item.variant_id) {
                              line = JSON.stringify(line);
                              return <span>{price}</span>;
                            }
                            line = JSON.stringify(line);
                          })}
                          <Button
                            type="link"
                            onClick={() =>
                              this.deleteProduct({
                                variant_id: item.variant_id,
                                image: item.image,
                                productTitle: item.productTitle,
                                variantTitle: item.variantTitle,
                                price: item.price,
                                sku: item.sku,
                              })
                            }
                          >
                            X
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              <Card bordered={false}>
                <Col lg={{ span: 13 }}>
                  <h4>Notes</h4>
                  <TextArea
                    id="notes"
                    placeholder="Add a note..."
                    autoSize={true}
                    value={value.notes}
                    onChange={this.handleChange}
                  />
                </Col>
                <Col lg={{ span: 4, push: 3 }}>
                  <p>Add discount</p>
                  <p>Subtotal</p>
                  <p>Add shipping</p>
                  <p>Taxes</p>
                  <h4>Total</h4>
                </Col>
                <Col lg={{ span: 2, push: 5 }}>
                  <p>***</p>
                  <p>{this.shoppingCartPrices()}</p>
                  <p>***</p>
                  <p>¥0.00</p>
                  <h4>{this.shoppingCartPrices()}</h4>
                </Col>
              </Card>
              <hr
                style={{
                  borderStyle: 'solid',
                  borderColor: '#d9d9d9',
                  borderTop: '1px',
                  margin: '0 -20px',
                }}
              />
              <Card bordered={false}>
                <Col lg={{ span: 8 }}>
                  <p style={{ fontWeight: '400', fontSize: '20px', margin: '0' }}>
                    <Icon
                      type="wallet"
                      style={{ fontSize: '20px', color: '#002766', marginRight: '10px' }}
                    />
                    ACCEPT PAYMENT
                  </p>
                </Col>
                <Col lg={{ span: 16 }}>
                  <Button
                    disabled={!Boolean(checkedbox.length)}
                    onClick={() => this.createOrder('paid')}
                    style={{ marginLeft: '15px' }}
                  >
                    <NavLink to="/orders/all_list">Mark as paid</NavLink>
                  </Button>
                  <Button
                    disabled={!Boolean(checkedbox.length)}
                    onClick={() => this.createOrder('pending')}
                    style={{ marginLeft: '15px' }}
                  >
                    <NavLink to="/orders/all_list">Mark as pending</NavLink>
                  </Button>
                  <Button disabled style={{ marginLeft: '15px' }}>
                    <NavLink to="/orders/all_list">Pay with credit card</NavLink>
                  </Button>
                </Col>
              </Card>
            </Card>
          </Col>
          <Col lg={{ span: 6 }}>
            {conceal ? (
              <Card>
                <h3>Find or create a searchCustomer</h3>
                <Select
                  showSearch
                  placeholder="Select users"
                  value={value.customerName}
                  style={{ width: '100%' }}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  loading={loading && !Boolean(customers.length)}
                  onFocus={this.getCustomer}
                  onBlur={this.resetSelect}
                  // onSearch的value是Select中的value
                  onSearch={this.searchCustomer}
                  // onSelect的value是Option中的value
                  onSelect={this.showCustomerInfo}
                  notFoundContent={null}
                >
                  {customers.map((item, index) => (
                    <Option key={index} value={item.id}>
                      <List.Item.Meta
                        key={index}
                        avatar={
                          <Avatar
                            style={{ backgroundColor: '#0050b3', verticalAlign: 'middle' }}
                            size="large"
                          >
                            {item.first_name}
                          </Avatar>
                        }
                        title={[item.first_name, ' ', item.last_name]}
                        description={item.email || item.phone || 'No email provided'}
                      />
                    </Option>
                  ))}
                </Select>
              </Card>
            ) : (
              <Card>
                <List>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: '#0050b3', verticalAlign: 'middle' }}
                          size={60}
                        >
                          {customer.first_name}
                        </Avatar>
                      }
                      title={
                        <div style={{ fontSize: 20, color: '#000000', marginBottom: 10 }}>
                          Customer
                          <Button
                            onClick={this.closeCustomerInfo}
                            type="link"
                            style={{ float: 'right' }}
                          >
                            X
                          </Button>
                        </div>
                      }
                      description={
                        <div>
                          <h4>{[customer.first_name, ' ', customer.last_name]}</h4>
                          <div>
                            {value.email || 'No email provided'}
                            <Button
                              onClick={() => this.showModal('email')}
                              type="link"
                              style={{ float: 'right' }}
                            >
                              Edit
                            </Button>
                          </div>
                          <div>{customer.phone}</div>
                        </div>
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div style={{ color: '#000000' }}>
                          SHIPPING ADDRESS
                          <Button
                            onClick={() => alert('功能为实现')}
                            type="link"
                            style={{ float: 'right' }}
                          >
                            Edit
                          </Button>
                        </div>
                      }
                      description={
                        customer.addresses.length === 0 ? (
                          <div>No shipping address was provided.</div>
                        ) : (
                          <div>
                            <div>{customer.addresses[0].name}</div>
                            <div>
                              {[
                                customer.addresses[0].address1,
                                ' ',
                                customer.addresses[0].address2,
                                ' ',
                                customer.addresses[0].city,
                              ]}
                            </div>
                            <div>
                              {[customer.addresses[0].zip, ' ', customer.addresses[0].province]}
                            </div>
                            <div>{customer.addresses[0].country}</div>
                          </div>
                        )
                      }
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div style={{ color: '#000000' }}>
                          BILLING ADDRESS
                          <Button
                            onClick={() => alert('功能为实现')}
                            type="link"
                            style={{ float: 'right' }}
                          >
                            Edit
                          </Button>
                        </div>
                      }
                      description={
                        customer.addresses.length === 0 ? (
                          <div>Same as shipping address</div>
                        ) : (
                          <div>
                            <div>{customer.addresses[0].name}</div>
                            <div>
                              {[
                                customer.addresses[0].address1,
                                ' ',
                                customer.addresses[0].address2,
                                ' ',
                                customer.addresses[0].city,
                              ]}
                            </div>
                            <div>
                              {[customer.addresses[0].zip, ' ', customer.addresses[0].province]}
                            </div>
                            <div>{customer.addresses[0].country}</div>
                          </div>
                        )
                      }
                    />
                  </List.Item>
                </List>
              </Card>
            )}
          </Col>
        </Row>
        <hr
          style={{
            borderStyle: 'solid',
            borderColor: '#d9d9d9',
            borderTop: '1px',
            margin: '20px 0',
          }}
        />
        <Row gutter={[16, 24]}>
          <Col lg={{ offset: 18, span: 3, push: 3 }}>
            <Button
              disabled={!Boolean(checkedbox.length)}
              type="primary"
              onClick={this.createDraft_orders}
            >
              <NavLink to="/orders/drafts_orders">Save draft order</NavLink>
            </Button>
          </Col>
        </Row>
        <Modal
          title="Select products"
          visible={visible.product}
          okText="Add to order"
          onOk={this.onOkAddToOrder}
          cancelText="Cancel"
          onCancel={() => this.Cancel('product')}
        >
          <Search
            id="product"
            placeholder="Search products"
            value={value.product}
            onChange={this.handleChange}
            onSearch={this.getProducts}
          />
          {products.length === 0 && !loading ? (
            <List
              dataSource={data}
              renderItem={(item, key) => (
                <List.Item key={key}>
                  <a onClick={() => this.getProducts(item)}>{item}</a>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '10px' }}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={loading && hasMore}
                useWindow={false}
              >
                <List
                  dataSource={products}
                  renderItem={(product, index) => (
                    <div>
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={<Avatar shape="square" src={product.image.src} />}
                        />
                        <span>{product.title}</span>
                      </List.Item>
                      {product.variants.map((variant, index) => (
                        <List.Item key={index}>
                          <Checkbox
                            style={{ margin: '0 20px' }}
                            onChange={this.checkboxChange}
                            value={{
                              variant_id: variant.id,
                              image: product.image.src,
                              productTitle: product.title,
                              variantTitle: variant.title,
                              price: variant.price,
                              sku: variant.sku,
                            }}
                          />
                          {variant.title}
                          <span style={{ float: 'right' }}>
                            {variant.inventory_quantity} in stock ¥ {variant.price}
                          </span>
                        </List.Item>
                      ))}
                    </div>
                  )}
                >
                  {loading && hasMore && (
                    <div style={{ textAlign: 'center' }}>
                      <Spin />
                    </div>
                  )}
                </List>
              </InfiniteScroll>
            </div>
          )}
        </Modal>
        <Modal
          title="Edit email"
          visible={visible.email}
          okText="Apply"
          onOk={this.onOkApply}
          cancelText="Cancel"
          onCancel={() => this.Cancel('email')}
        >
          <div>Notification emails will be sent to this address.</div>
          <div>Email</div>
          <Input
            id="email"
            allowClear
            value={value.email}
            onChange={id => this.handleChange(id)}
          ></Input>
          {regexp && (
            <Alert
              message="Email format error , Demonstration（123456@qq.com）"
              type="error"
              showIcon
            />
          )}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default index;
