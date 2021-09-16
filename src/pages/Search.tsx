import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'querystring';
import SearchBar from '../components/SearchBar';
import Item from '../components/Item';
import { useEffect } from 'react';
import axios from 'axios';
import home from '../home.svg';

export interface ItemInterface {
  shop: string;
  name: string;
  price: string;
  outOfStock: boolean;
  imgUrl: string;
  url: string;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type HeaderProps = {
  animated: boolean;
};

const Header = styled.header<HeaderProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  background-image: linear-gradient(to bottom right, #002f4b, #dc4225);
  width: 100vw;
  height: 64px;
  border-bottom: 1px solid black;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  animation-name: ${props => (props.animated ? 'slidedown' : 'none')};
  animation-duration: 1000ms;

  @keyframes slidedown {
    from {
      transform: translateY(-64px);
    }
  }
`;

const Home = styled.img`
  width: 48px;
  height: 48px;
  cursor: pointer;
`;

const Empty = styled.div`
  height: 64px;
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  max-width: 1080px;
`;

function Search({
  location: {
    state: { prevPath },
  },
}: any) {
  const history = useHistory();
  const { search } = useLocation();
  const keyword = qs.parse(search.slice(1)).keyword;
  const [loading, setLoading] = useState<boolean>();
  const [items, setItems] = useState([]);

  const searchItems = useCallback(async () => {
    if (keyword.length > 1) {
      setLoading(true);
      let items = await axios
        .get(process.env.NODE_ENV === 'development' ? `http://localhost:4000/api/search/${keyword}` : `/api/search/${keyword}`)
        .then(data => data.data);
      items = items.filter((item: ItemInterface) => !item.outOfStock).concat(items.filter((item: ItemInterface) => item.outOfStock));
      setItems(items);
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    searchItems();
  }, [searchItems]);

  return (
    <Container>
      <Header animated={prevPath === '/'}>
        <Home src={home} alt="homeButton" onClick={() => history.push('/')} />
      </Header>
      <Empty></Empty>
      <SearchBar initialKeyword={keyword} prevPath={prevPath} />
      {loading ? (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : items.length === 0 ? (
        <Items
          style={{ textAlign: 'center', color: 'white', fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', wordSpacing: '2px' }}
        >
          {keyword.length > 1 ? `"${keyword}"에 해당하는 검색 결과 없음` : '검색어는 최소 2자 이상 적어주세요.'}
        </Items>
      ) : (
        <Items>
          {items.map((item: ItemInterface, i) => (
            <Item
              key={i}
              shop={item.shop}
              name={item.name}
              price={item.price}
              outOfStock={item.outOfStock}
              imgUrl={item.imgUrl}
              url={item.url}
              delay={i * 100 < 1000 ? i * 100 : 1000}
            />
          ))}
        </Items>
      )}
    </Container>
  );
}

export default Search;
