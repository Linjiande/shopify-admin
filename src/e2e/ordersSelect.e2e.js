import puppeteer from 'puppeteer';
import { order, status, financial_status, fulfillment_status } from './__mocks__/ordersSelect';

describe('Select', () => {
  it('should select with succeed', async () => {
    const browser = await puppeteer.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();

    await page.goto('http://localhost:8000/#/orders/all_list');

    await page.setViewport({ width: 1536, height: 731 });

    //上、下一页
    let next = await page.waitForSelector('li.ant-pagination-next');
    await next.click();
    // next = await page.waitForSelector('li.ant-pagination-next');
    await next.click();

    // const prev = await page.waitForSelector('li.ant-pagination-prev');
    // await prev.click();

    //page.$$（`.ant-select-dropdown>div  > ul > li:nth-child（数字）`）筛选出3个元素标签
    let arr = []; //存储3元素标签
    // 选择status
    await page.click('#status > div');
    // await page.click(`.ant-select-dropdown>div  > ul > li:nth-child(${status})`);
    arr = await page.$$(`.ant-select-dropdown>div  > ul > li:nth-child(${status})`);
    await arr[0].click();

    //多选financial_status
    await page.click('#financial_status > div');
    for (let i = 0; i < financial_status.length; i++) {
      arr = await page.$$(`.ant-select-dropdown>div  > ul > li:nth-child(${financial_status[i]})`);
      console.log('arr[1]=======', arr[1]);
      await (arr[1] || arr[0]).click();
    }

    // 多选fulfillment_status
    await page.click('#fulfillment_status > div');
    for (let i = 0; i < fulfillment_status.length; i++) {
      arr = await page.$$(
        `.ant-select-dropdown>div  > ul > li:nth-child(${fulfillment_status[i]})`,
      );
      await (arr[2] || arr[1]).click();
    }

    // 输入order
    const orderInput = await page.waitForSelector('.ant-row #name');
    await orderInput.click();
    await orderInput.type(order);

    // 查询
    const selectBtn = await page.waitForSelector(
      '.ant-form > .ant-row > .ant-col > div > .ant-btn:nth-child(1)',
    );
    await selectBtn.click();

    // 重置
    await page.waitForSelector('.ant-form > .ant-row > .ant-col > div > .ant-btn:nth-child(2)');
    await page.click('.ant-form > .ant-row > .ant-col > div > .ant-btn:nth-child(2)');

    // await browser.close();
  });
});
