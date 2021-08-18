import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';
import qs from 'querystring';
import SearchBar from '../components/SearchBar';
import Card from '../components/Item';
import { useEffect } from 'react';
import axios from 'axios';

export interface Item {
  shop: string;
  name: string;
  price: string;
  outOfStock: boolean;
  imgUrl: string;
  url: string;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 0 30vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Items = styled.div`
  margin-top: 20px;
  min-width: 300px;
`;

function Search() {
  const { search } = useLocation();
  const keyword = qs.parse(search.slice(1)).keyword;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const searchItems = useCallback(async () => {
    let items = await axios.post('http://localhost:4000/', { keyword }).then(data => data.data);
    items = items.filter((item: Item) => !item.outOfStock).concat(items.filter((item: Item) => item.outOfStock));
    setItems(items);
    setLoading(false);
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
          검색 결과 없음
        </Items>
      ) : (
        <Items>
          {items.map((item: Item, i) => (
            <Card
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
