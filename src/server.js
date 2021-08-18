const path = require('path');
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');
const phantom = require('phantom');
const PORT = process.env.PORT || 4000;
const app = express();

const shops = { gimbab: '김밥레코즈', soundsgood: '사운즈굿 스토어', doperecord: '도프레코드' };
const baseUrls = { gimbab: 'https://gimbabrecords.com', soundsgood: 'https://soundsgood-store.com', doperecord: 'https://doperecord.com' };
const searchUrls = {
  gimbab: 'https://gimbabrecords.com/product/search.html?keyword=',
  //   soundsgood: 'https://soundsgood-store.com/productSearch?',
  doperecord: 'https://doperecord.com/product/search.html?keyword=',
};

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../build')));

const getHtml = async (shop, url) => {
  try {
    const html = await axios.get(encodeURI(url));
    return { shop, html };
  } catch (error) {
    console.error(error);
  }
};

const getPageNums = async keyword => {
  const promises = Object.entries(searchUrls).map(([shop, url]) =>
    getHtml(shop, `${url}${keyword}`).then(async data => {
      const { shop, html } = data;
      const $ = cheerio.load(html.data);
      let page;
      switch (shop) {
        case 'gimbab':
          page = $('#paging ol').children().length;
          break;
        case 'soundsgood':
          page = 1;
          break;
        case 'doperecord':
          page = $('.xans-search-paging .xans-record-').length;
        default:
          break;
      }
      return { shop, page };
    })
  );

  const raw = await Promise.all(promises);
  const result = {};
  for (const { shop, page } of raw) {
    result[shop] = page;
  }
  return result;
};

const generateSearchUrl = (shop, keyword, page) => {
  switch (shop) {
    case 'gimbab':
      return `${searchUrls[shop]}${keyword}&page=${page + 1}`;
    case 'soundsgood':
      return `${searchUrls[shop]}${page + 1 === 1 ? '' : `productListPage=${page + 1}&`}productSearchKeyword=${keyword}`;
    case 'doperecord':
      return `${searchUrls[shop]}${keyword}&page=${page + 1}`;
    default:
      break;
  }
};

const getItems = async (keyword, pageNums) => {
  const shopPromises = Object.keys(searchUrls).map(async shop => {
    const pagePromises = new Array(pageNums[shop]).fill(null).map((_, i) =>
      getHtml(shop, generateSearchUrl(shop, keyword, i)).then(data => {
        const items = [];
        const { shop, html } = data;
        const $ = cheerio.load(html.data);
        switch (shop) {
          case 'gimbab':
            $('.prdList .item').each((i, el) => {
              items[i] = {
                shop: shops[shop],
                name: $('.name .title', el).next().text().trim(),
                price: $('ul.xans-search-listitem .title', el).next().first().text().trim(),
                outOfStock: $('.name a', el).next().attr('alt').trim() === '품절',
                imgUrl: 'https:' + $('.thumb', el).attr('src').trim(),
                url: baseUrls[shop] + $('.name a', el).attr('href').trim(),
              };
            });
            break;
          case 'soundsgood':
            $('.shopProductWrapper').each((i, el) => {
              items[i] = {
                shop: shops[shop],
                name: $('.productName', el).text().trim(),
                price: $('.productPriceSpan', el).text().trim(),
                outOfStock: $('.badgeWrapper', el).children().first().hasClass(),
                imgUrl: $('.thumb', el).first().attr('imgsrc').trim(),
                url: baseUrls[shop] + $('a', el).attr('href').trim(),
              };
            });
            break;
          case 'doperecord':
            $('.prdList > li').each((i, el) => {
              items[i] = {
                shop: shops[shop],
                name: $('.name', el).text().trim(),
                price: $('ul.xans-search-listitem .title', el).next().first().text().trim(),
                outOfStock: $('.promotion img', el)?.attr('alt') === '품절',
                imgUrl: 'https:' + $('.prdImg img', el).attr('src'),
                url: baseUrls[shop] + $('.prdImg a', el).attr('href'),
              };
            });
            break;
          default:
            break;
        }
        return items;
      })
    );

    const raw = await Promise.all(pagePromises);
    return raw.flat(1);
  });

  const raw = await Promise.all(shopPromises);
  return raw.flat(1);
};

app.post('/', async (req, res) => {
  const {
    body: { keyword },
  } = req;
  const pageNums = await getPageNums(keyword);
  await getItems(keyword, pageNums).then(data => res.send(data));
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
