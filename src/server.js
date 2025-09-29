const path = require('path');
const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const axios = require('axios');
const PORT = process.env.PORT || 4000;
const app = express();

const shops = {
  gimbab: '김밥레코즈',
  gimbab2: '김밥레코즈2',
  doperecord: '도프레코드',
  soundsgood: '사운즈굿 스토어',
  seoulvinyl: '서울바이닐',
  welcome: '웰컴레코즈',
};
const baseUrls = {
  gimbab: 'https://gimbabrecords.com',
  gimbab2: 'https://gimbabrecords2.com',
  doperecord: 'https://doperecord.com',
  // soundsgood: 'https://soundsgood-store.com',
  // seoulvinyl: 'https://www.seoulvinyl.com',
  // welcome: 'https://welcomerecords.kr',
};
const searchUrls = {
  gimbab: `${baseUrls.gimbab}/product/search.html?keyword=`,
  gimbab2: `${baseUrls.gimbab2}/product/search.html?keyword=`,
  doperecord: `${baseUrls.doperecord}/product/search.html?keyword=`,
  // soundsgood: `${baseUrls.soundsgood}/productSearch?`,
  // seoulvinyl: `${baseUrls.seoulvinyl}/productSearch?`,
  // welcome: `${baseUrls.welcome}/productSearch?`,
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
  const promises = Object.entries(searchUrls).map(async ([shop, url]) => {
    let page = 1;
    switch (shop) {
      case 'gimbab':
      case 'gimbab2':
      case 'doperecord':
        return getHtml(shop, `${url}${keyword}`).then(async data => {
          const { shop, html } = data;
          const $ = cheerio.load(html.data);
          switch (shop) {
            case 'gimbab':
            case 'gimbab2':
            case 'doperecord':
              page = $('.xans-search-paging ol').children().length;
              break;
            default:
              break;
          }
          return { shop, page };
        });
      case 'soundsgood':
      case 'seoulvinyl':
      case 'welcome':
        const browser = await puppeteer.launch();
        const rawPage = await browser.newPage();
        await rawPage
          .waitForSelector('.paginationNumbers', { timeout: 5000 })
          .then(() => rawPage.content())
          .then(async html => {
            const $ = cheerio.load(html);
            switch (shop) {
              case 'soundsgood':
              case 'seoulvinyl':
              case 'welcome':
                page = $('.paginationNumbers').children().length;
                break;
              default:
                break;
            }
            await browser.close();
            return page;
          })
          .catch(() => {
            console.log(`${shop}'s page number is 0 or 1.`);
            return page;
          });
        return { shop, page: await rawPage.goto(`${url}productSearchKeyword=${keyword}`) };
    }
  });

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
    case 'gimbab2':
    case 'doperecord':
      return `${searchUrls[shop]}${keyword}&page=${page + 1}`;
    case 'soundsgood':
    case 'seoulvinyl':
    case 'welcome':
      return `${searchUrls[shop]}${page === 0 ? '' : `productListPage=${page + 1}&`}productSearchKeyword=${keyword}`;
    default:
      break;
  }
};

const getItems = async (keyword, pageNums) => {
  const shopPromises = Object.keys(searchUrls).map(async shop => {
    const pagePromises = new Array(pageNums[shop]).fill(null).map(async (_, i) => {
      switch (shop) {
        case 'gimbab':
        case 'gimbab2':
        case 'doperecord':
          return getHtml(shop, generateSearchUrl(shop, keyword, i)).then(data => {
            const items = [];
            const { shop, html } = data;
            const $ = cheerio.load(html.data);
            switch (shop) {
              case 'gimbab':
              case 'gimbab2':
                $('.prdList > .xans-record-').each((i, el) => {
                  items[i] = {
                    shop: shops[shop],
                    name: $('.name', el).text().trim(),
                    price: $('.title', el).next().text().trim(),
                    outOfStock: $('.icon_img', el)?.attr('alt') === '품절',
                    imgUrl: $('.thumbnail img', el)?.attr('src')?.trim(),
                    url: baseUrls[shop] + $('.thumbnail a', el)?.attr('href')?.trim(),
                  };
                });
                break;
              case 'doperecord':
                $('.prdList > li').each((i, el) => {
                  items[i] = {
                    shop: shops[shop],
                    name: $('.name', el).text().trim(),
                    price: $('ul.xans-search-listitem .title', el).next().first().text().trim(),
                    outOfStock: $('.icon_img', el)?.attr('alt') === '품절',
                    imgUrl: "https:" + $('.thumbnail img', el)?.attr('src')?.trim(),
                    url: baseUrls[shop] + $('.thumbnail a', el)?.attr('href')?.trim(),
                  };
                });
                break;
              default:
                break;
            }
            return items;
          });
        case 'soundsgood':
        case 'seoulvinyl':
        case 'welcome':
          const browser = await puppeteer.launch();
          const rawPage = await browser.newPage();
          const items = rawPage
            .waitForSelector('.productListPage', { timeout: 5000 })
            .then(() => rawPage.content())
            .then(async html => {
              const items = [];
              const $ = cheerio.load(html);
              switch (shop) {
                case 'soundsgood':
                case 'seoulvinyl':
                case 'welcome':
                  $('.productListPage')
                    .children()
                    .each((i, el) => {
                      items[i] = {
                        shop: shops[shop],
                        name: $('.productName', el).text().trim(),
                        price: $('.productPriceSpan', el).text().trim(),
                        outOfStock: $('.badgeWrapper', el).children().first().hasClass('soldOutBadge'),
                        imgUrl: $('.thumb', el).first().attr('imgsrc').trim(),
                        url: baseUrls[shop] + $('a', el).attr('href').trim(),
                      };
                    });
                  break;
                default:
                  break;
              }
              await browser.close();
              return items;
            })
            .catch(() => {
              console.log(`Cannot get items from ${shop} #${i + 1}`);
              return [];
            });
          return rawPage.goto(generateSearchUrl(shop, keyword, i)).then(() => items);
      }
    });

    const raw = await Promise.all(pagePromises);
    return raw.flat(1);
  });

  const raw = await Promise.all(shopPromises);
  return raw.flat(1);
};

app.get('/api/search/:keyword', async (req, res) => {
  const {
    params: { keyword },
  } = req;
  const pageNums = await getPageNums(keyword);
  const items = await getItems(keyword, pageNums);
  return res.send(items);
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
