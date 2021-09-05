import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import qs from 'querystring';
import SearchBar from '../components/SearchBar';
import Item from '../components/Item';
import { useEffect } from 'react';
import axios from 'axios';

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

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  max-width: 1080px;
`;

function Search() {
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
      <SearchBar initialKeyword={keyword} />
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
            />
          ))}
        </Items>
      )}
    </Container>
  );
}

export default Search;
