import {
    Card,
    Icon,
    Button,
    Row,
    Col,
    Input,
    Modal,
    List,
} from 'antd'
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

class index extends Component {
    state = {
        visible: false,
        value:{
            product:'',
            notes:'',
            customer:''
        },
        data: [
            'All products',
            'Product types',
            'Vendors',
        ],
    };

    handleChange = (e) => {
        const { value } = this.state
        if(e.target.id==="product")
        this.setState({
            value: {
                product:e.target.value,
                notes:value.notes,
                customer:value.customer,
            }
        });
        if(e.target.id==="notes")
        this.setState({
            value: {
                notes:e.target.value,
                product:value.product,
                customer:value.customer,
            }
        });
        if(e.target.id==="customer")
        this.setState({
            value: {
                customer:e.target.value,
                notes:value.notes,
                product:value.product,
            }
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    showProducts = classify => {
        console.log(classify)
    }

    render() {
        const { Search,TextArea } = Input;
        const { visible, value, data } = this.state
        return (
            <PageHeaderWrapper title="Create order">
                <Row type="flex" justify="space-around" gutter={ [16,24] } >
                    <Col lg={{ span: 16 }}>
                        <Card>
                            <Card bordered={false}>
                                <h2 class="next-heading">
                                    Order details
                                </h2>
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
                            <Card bordered={false}>
                                <Col lg={{ span: 10 }}>
                                    <h4>Notes</h4>
                                    <TextArea
                                        id="notes"
                                        autoSize={true}
                                        value={value.notes}
                                        onChange={this.handleChange}
                                    />
                                </Col>
                                <Col lg={{ span: 4, push: 4 }}>
                                    <p>Add discount</p>
                                    <p>Subtotal</p>
                                    <p>Add shipping</p>
                                    <p>Taxes</p>
                                    <h4>Total</h4>
                                </Col>
                                <Col lg={{ span: 2, push: 6 }}>
                                    <p>***</p>
                                    <p>000</p>
                                    <p>***</p>
                                    <p>000</p>
                                    <h4>000</h4>
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
                                    <Button style={{ marginLeft: "15px" }}>Mark as paid</Button>
                                    <Button style={{ marginLeft: "15px" }}>Mark as pending</Button>
                                    <Button style={{ marginLeft: "15px" }}>Pay with credit card</Button>
                                </Col>
                            </Card>
                        </Card>
                    </Col>
                    <Col lg={{ span: 6 }}>
                        <Card>
                            <h3 class="next-heading">
                                Find or create a customer
                                </h3>
                            <Search
                                id="customer"
                                placeholder="Search customer"
                                size="large"
                                maxLength="500"
                                value={value.customer}
                                onChange={this.handleChange}
                                onSearch={value => console.log(value)}
                            />
                        </Card>
                    </Col>
                </Row>
                <hr style={{ borderStyle: "solid", borderColor: "#d9d9d9", borderTop: "1px", margin: "20px 0" }} />
                <Row gutter={ [16,24] }>
                    <Col lg={{ offset:18, span: 3, push:3 }}>
                        <Button type="primary">Save draft order</Button>
                    </Col>
                </Row>
                <Modal
                    title="Select products"
                    visible={visible}
                    okText="Add to order"
                    onOk={this.handleOk}
                    cancelText="cancel"
                    onCancel={this.handleCancel}
                >
                    <Search
                        id="product"
                        placeholder="Search products"
                        value={value.product}
                        onChange={this.handleChange}
                    />
                    <List
                        size="large"
                        dataSource={data}
                        renderItem={item =>
                            <List.Item>
                                <a onClick={() => this.showProducts(item)}>{item}</a>
                            </List.Item>
                        }
                    />
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default index;