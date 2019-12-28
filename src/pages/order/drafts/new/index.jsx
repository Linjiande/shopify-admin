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
} from 'antd'
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect(({ drafts }) => ({
    drafts
}))
class index extends Component {
    state = {
        data: [
            'All products',
            'Product types',
            'Vendors',
        ],
        value: {
            product: '',
            notes: '',
            customerName: undefined
        },
        visible: false,
        conceal: true,
        loading: false,
        hasMore: true,
        checkbox: [],
        checkedbox: [],
        line_items: [],
        customer: {},
        searchCustomer: [],
    };

    // product和notes,改变输入框
    handleChange = e => {
        const { value } = this.state
        switch (e.target.id) {
            case "product":
                this.setState({
                    value: {
                        ...value,
                        product: e.target.value,
                    }
                });
                break;
            case "notes":
                this.setState({
                    value: {
                        ...value,
                        notes: e.target.value,
                    }
                });
                break;
            default:
                console.log(e.target.id);
        }
    };
    // Customer,改变输入框,搜索框的值
    searchCustomer = e => {
        const { drafts: { customers } } = this.props
        const { value } = this.state
        this.setState({
            value: {
                ...value,
                customerName: e,
            }
        });
        customers.forEach(item => {
            const name = item.first_name + item.last_name + ""
            if (name.search(e) !== -1 || name.search(e) !== -1) {
                this.setState({
                    searchCustomer: item
                })
            }
        })
    }
    resetSelect = () => {
        const { value } = this.state
        this.setState({
            value: {
                ...value,
                customerName: undefined,
            }
        });
    }


    // 对话框Modal显示状态的控制
    showModal = () => {
        const { value: { product } } = this.state
        this.setState({
            visible: true,
            loading: false,
        });
        if (product.length > 0) {
            this.getProducts(product)
        }
    };
    //对话框Modal取消按钮
    cancel = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'drafts/initialize',
        })
        this.setState({
            visible: false,
            checkbox: [],
        });
    };
    // 对话框Modal添加按钮
    addToOrder = async () => {
        const { checkbox, checkedbox, line_items } = this.state
        const { dispatch } = this.props
        dispatch({
            type: 'drafts/initialize',
        })
        checkbox.forEach(item => {
            item = JSON.parse(item);
            for (let i = 0; i < checkedbox.length; i++) {
                checkedbox[i] = JSON.parse(checkedbox[i]);
                if (checkedbox[i].variant_id === item.variant_id) {
                    checkedbox.splice(i, 1)
                    break;
                }
                checkedbox[i] = JSON.stringify(checkedbox[i]);
            }
        });
        await this.setState({
            visible: false,
            checkedbox: [
                ...checkedbox,
                ...checkbox,
            ],
            checkbox: []
        });
        this.state.checkedbox.forEach(item => {
            item = JSON.parse(item);
            line_items.forEach((line, index) => {
                line = JSON.parse(line);
                if (line.variant_id === item.variant_id) {
                    line_items.splice(index, 1)
                }
                line = JSON.stringify(line);
            })
            line_items.push(JSON.stringify({
                variant_id: item.variant_id,
                quantity: 1,
                prices: Number(item.price)
            }))
            item = JSON.stringify(item);
        });
        this.setState({
            line_items
        })
    };
    //Customer模块的卡片Card显示控制
    showCustomerInfo = (id) => {
        const { drafts: { customers } } = this.props
        this.setState({
            conceal: false
        });
        customers.map(item => {
            if (item.id === id) {
                this.setState({
                    customer:
                        item
                })
            }
        })
    }
    //Customer模块的卡片Card显示控制
    closeCustomerInfo = () => {
        this.setState({
            conceal: true,
            customer: {}
        });
    }

    // 商品选择
    checkboxChange = e => {
        let { checkbox } = this.state
        const value = JSON.stringify(e.target.value)
        const index = checkbox.indexOf(value);
        if (e.target.checked === true && index === -1) {
            this.setState({
                checkbox: [...checkbox, value],
            })
        } else if (e.target.checked === false && index !== -1) {
            checkbox.splice(index, 1);
            this.setState({
                checkbox,
            })
        }
    }
    // 获取商品列表的无线下拉加载
    handleInfiniteOnLoad = () => {
        const { dispatch, drafts: { header } } = this.props;
        const temp = [];
        let url = '';
        this.setState({
            loading: false,
        });
        const regexp = /<(.+)>[;]\srel="([a-z]+)"/
        header.forEach(element => {
            // exec是正则的方法、match是字符串的方法,
            // 各自优点：exec信息详细，match方便
            const urlrel = regexp.exec(element);
            url = urlrel[1].replace(/.+2019-10/, "");
            const rel = urlrel[2];
            temp.push(rel)
        })
        if (temp.length === 1 && temp[0] === "previous") {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
            });
            return;
        }
        if ((temp.length === 1 && temp[0] === "next") ||
            (temp.length === 2 && temp[1] === "next")) {
            dispatch({
                type: "drafts/getRel",
                payload: url
            })
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
                line_items.splice(i, 1, JSON.stringify({
                    variant_id,
                    quantity: value,
                    prices: Number(price) * value.toFixed(2),
                }))
                break;
            }
            line_items[i] = JSON.stringify(line_items[i]);
        }
        this.setState({
            line_items
        })
    }
    // 删除选中的商品
    deleteProduct = e => {
        let { checkedbox, line_items } = this.state;
        // json对象转换成字符串，查询匹配得到对应索引index，反之索引index为-1
        const item = JSON.stringify(e)
        index = checkedbox.indexOf(item);
        checkedbox.splice(index, 1);
        // 根据variant_id删除数组中对应的line_items元素
        for (let i = 0; i < line_items.length; i++) {
            line_items[i] = JSON.parse(line_items[i]);
            if (line_items[i].variant_id === e.variant_id) {
                line_items.splice(i, 1)
                break;
            }
            line_items[i] = JSON.stringify(line_items[i]);
        }

        this.setState({
            checkedbox,
            line_items
        })
    }


    // 计算商品列表(选中的全部商品)总价格
    shoppingCartPrices = () => {
        const { line_items } = this.state
        let price = 0
        return line_items.length !== 0 ?
            line_items.map((line, index) => {
                line = JSON.parse(line)
                price += line.prices
                line = JSON.stringify(line)
                if (index === line_items.length - 1) {
                    return <span>{price}</span>
                }
            }) :
            <span>¥0.00</span>
    }


    // 获取商品信息列表
    getProducts = async param => {
        const { dispatch } = this.props
        this.setState({
            loading: true
        });
        switch (param) {
            case "All products":
            case "Product types":
            case "Vendors":
                await dispatch({
                    type: "drafts/getProducts",
                    payload: { limit: 5 }
                });
                break;
            default:
                await dispatch({
                    type: "drafts/getProducts",
                    payload: { limit: 5 }
                });
                console.log(param);
        }
        this.setState({
            loading: false
        });
    }
    // 获取顾客信息列表
    getCustomer = () => {
        const { dispatch } = this.props
        this.setState({
            loading: true,
            searchCustomer: []
        });
        dispatch({
            type: "drafts/getCustomers",
        });
    }
    // 创建订单
    createOrder = (financial_status) => {
        const { dispatch } = this.props;
        const { line_items, value: { notes }, customer: { id } } = this.state;
        const temp = [];
        line_items.forEach(line => {
            line = JSON.parse(line)
            temp.push(line)
        })
        const payload1 = {
            order: {
                line_items: temp, notes, financial_status
            }
        }
        const payload2 = {
            order: {
                line_items: temp, notes, customer: { "id": id }, financial_status
            }
        }
        id === undefined ?
            dispatch({
                type: 'drafts/createOrder',
                payload: payload1,
            }) :
            dispatch({
                type: 'drafts/createOrder',
                payload: payload2,
            })
    }

    render() {
        const { Search, TextArea } = Input;
        const { Option } = Select;
        const { drafts: { products, customers } } = this.props
        const { visible, conceal, value, data, checkedbox, loading, hasMore, line_items, searchCustomer, customer } = this.state
        return (
            <PageHeaderWrapper title="Create order">
                <Row type="flex" justify="space-around" gutter={[16, 16]} >
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
                                    onSearch={this.showModal}
                                />
                            </Card>
                            {checkedbox.length !== 0 &&
                                checkedbox.map((item, key) => {
                                    item = JSON.parse(item)
                                    return (
                                        <Card bordered={false} key={key}>
                                            <Row type="flex" justify="space-around" align="middle" gutter={[16, 16]} >
                                                <Col lg={{ span: 3 }}>
                                                    <img src={item.image} style={{ width: "70px", height: "70px" }} />
                                                </Col>
                                                <Col lg={{ span: 10 }} style={{ textAlign: "center" }}>
                                                    <a>{item.productTitle}</a>
                                                    <div>{item.variantTitle}</div>
                                                    <div>{item.sku}</div>
                                                </Col>
                                                <Col lg={{ span: 10, push: 1 }} >
                                                    {item.price} &nbsp;
                                                    x &nbsp;
                                                    <InputNumber min={1} max={100} defaultValue={1} onChange={(value) => this.quantityChange(item.variant_id, value, item.price)} /> &nbsp;
                                                    ¥ &nbsp;
                                                    {
                                                        line_items.map(line => {
                                                            line = JSON.parse(line)
                                                            const price = line.prices
                                                            if (line.variant_id === item.variant_id) {
                                                                line = JSON.stringify(line)
                                                                return <span>{price}</span>
                                                            }
                                                            line = JSON.stringify(line)
                                                        })
                                                    }
                                                    <Button
                                                        type="link"
                                                        onClick={() => this.deleteProduct({
                                                            variant_id: item.variant_id,
                                                            image: item.image,
                                                            productTitle: item.productTitle,
                                                            variantTitle: item.variantTitle,
                                                            price: item.price,
                                                            sku: item.sku,
                                                        })}
                                                    >X</Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    )
                                })
                            }
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
                            <hr style={{ borderStyle: "solid", borderColor: "#d9d9d9", borderTop: "1px", margin: "0 -20px" }} />
                            <Card bordered={false}>
                                <Col lg={{ span: 8 }}>
                                    <p style={{ fontWeight: "400", fontSize: "20px", margin: "0" }}>
                                        <Icon type="wallet" style={{ fontSize: '20px', color: '#002766', marginRight: "10px" }} />
                                        ACCEPT PAYMENT
                                </p>
                                </Col>
                                <Col lg={{ span: 16 }}>
                                    <Button disabled={!Boolean(checkedbox.length)} onClick={() => this.createOrder('paid')} style={{ marginLeft: "15px" }}>Mark as paid</Button>
                                    <Button disabled={!Boolean(checkedbox.length)} onClick={() => this.createOrder('pending')} style={{ marginLeft: "15px" }}>Mark as pending</Button>
                                    <Button disabled style={{ marginLeft: "15px" }}>Pay with credit card</Button>
                                </Col>
                            </Card>
                        </Card>
                    </Col>
                    <Col lg={{ span: 6 }}>
                        {conceal ?
                            <Card>
                                <h3>Find or create a searchCustomer</h3>
                                <Select
                                    showSearch
                                    placeholder='Select users'
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
                                    {searchCustomer.length === 0 || value.searchCustomer === "" ?
                                        customers.map((item, index) => (
                                            <Option key={index} value={item.id}>
                                                <List.Item.Meta
                                                    key={index}
                                                    avatar={
                                                        <Avatar style={{ backgroundColor: '#0050b3', verticalAlign: 'middle' }} size="large">
                                                            {item.first_name}
                                                        </Avatar>
                                                    }
                                                    title={[item.first_name, " ", item.last_name]}
                                                    description={item.email || item.phone || "No email provided"}
                                                />
                                            </Option>
                                        )) :
                                        <Option value={searchCustomer.id}>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar style={{ backgroundColor: '#0050b3', verticalAlign: 'middle' }} size="large">
                                                        {searchCustomer.first_name}
                                                    </Avatar>
                                                }
                                                title={[searchCustomer.first_name, " ", searchCustomer.last_name]}
                                                description={searchCustomer.email || searchCustomer.phone || "No email provided"}
                                            />
                                        </Option>
                                    }
                                </Select>
                            </Card> :
                            <Card>
                                <List>
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar style={{ backgroundColor: '#0050b3', verticalAlign: 'middle' }} size={60}>
                                                    {customer.first_name}
                                                </Avatar>
                                            }
                                            title={
                                                <div style={{ fontSize: 20, color: '#000000' }}>
                                                    Customer
                                                <Button onClick={this.closeCustomerInfo} type="link" style={{ float: 'right' }}>X</Button>
                                                </div>
                                            }
                                            description={
                                                <div>
                                                    <h4>{[customer.first_name, " ", customer.last_name]}</h4>
                                                    <div>{customer.email}</div>
                                                    <div>{customer.phone}<Button type="link" style={{ float: 'right' }}>Edit</Button></div>
                                                </div>
                                            }
                                        />

                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <div style={{ color: '#000000' }}>
                                                    SHIPPING ADDRESS
                                                <Button type="link" style={{ float: 'right' }}>Edit</Button>
                                                </div>
                                            }
                                            description={
                                                customer.addresses.length === 0 ?
                                                    <div>No shipping address was provided.</div>
                                                    :
                                                    <div>
                                                        <div>{customer.addresses[0].name}</div>
                                                        <div>{[customer.addresses[0].address1, " ", customer.addresses[0].address2, " ", customer.addresses[0].city]}</div>
                                                        <div>{[customer.addresses[0].zip, " ", customer.addresses[0].province]}</div>
                                                        <div>{customer.addresses[0].country}</div>
                                                    </div>
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <div style={{ color: '#000000' }}>
                                                    BILLING ADDRESS
                                                    <Button type="link" style={{ float: 'right' }}>
                                                        Edit
                                                        </Button>
                                                </div>
                                            }
                                            description={
                                                customer.addresses.length === 0 ?
                                                    <div>Same as shipping address</div>
                                                    :
                                                    <div>
                                                        <div>{customer.addresses[0].name}</div>
                                                        <div>{[customer.addresses[0].address1, " ", customer.addresses[0].address2, " ", customer.addresses[0].city]}</div>
                                                        <div>{[customer.addresses[0].zip, " ", customer.addresses[0].province]}</div>
                                                        <div>{customer.addresses[0].country}</div>
                                                    </div>
                                            }
                                        />
                                    </List.Item>
                                </List>
                            </Card>
                        }
                    </Col>
                </Row>
                <hr style={{ borderStyle: "solid", borderColor: "#d9d9d9", borderTop: "1px", margin: "20px 0" }} />
                <Row gutter={[16, 24]}>
                    <Col lg={{ offset: 18, span: 3, push: 3 }}>
                        <Button disabled={!Boolean(checkedbox.length)} type="primary">Save draft order</Button>
                    </Col>
                </Row>
                <Modal
                    title="Select products"
                    visible={visible}
                    centered
                    okText="Add to order"
                    onOk={this.addToOrder}
                    cancelText="cancel"
                    onCancel={this.cancel}
                >
                    <Search
                        id="product"
                        placeholder="Search products"
                        value={value.product}
                        onChange={this.handleChange}
                        onSearch={this.getProducts}
                    />
                    {
                        products.length === 0 && !loading ?
                            <List
                                dataSource={data}
                                renderItem={(item, key) =>
                                    <List.Item key={key}>
                                        <a onClick={() => this.getProducts(item)}>{item}</a>
                                    </List.Item>
                                }
                            /> :
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
                                        renderItem={
                                            (product, index) =>
                                                <div>
                                                    <List.Item key={index}>
                                                        <List.Item.Meta
                                                            avatar={<Avatar shape="square" src={product.image.src} />}
                                                        />
                                                        <span>{product.title}</span>
                                                    </List.Item>
                                                    {
                                                        product.variants.map((variant, index) =>
                                                            <List.Item key={index}>
                                                                <Checkbox style={{ margin: '0 20px' }}
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
                                                            </List.Item>)
                                                    }
                                                </div>
                                        }
                                    >
                                        {loading && hasMore && (
                                            <div style={{ textAlign: 'center' }}>
                                                <Spin />
                                            </div>
                                        )}
                                    </List>
                                </InfiniteScroll>
                            </div>
                    }
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default index;