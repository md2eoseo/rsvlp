import styled from '@emotion/styled';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import logo from '../logo.svg';

const Container = styled.form`
  position: relative;
  height: 64px;
  width: 60vw;
  min-width: 280px;
  border-radius: 50vh;
  margin: 20px 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding-left: 32px;
  padding-right: 72px;
  font-size: 1.8rem;
  border: none;
  border-radius: 50vh;
  outline: none;
  ::placeholder {
    font-size: 1.5rem;
  }
`;

const SearchButton = styled.button`
  min-height: 60px;
  min-width: 60px;
  position: absolute;
  right: 2px;
  top: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50vh;
  outline: none;
  background-color: transparent;
`;

const Logo = styled.img`
  animation: spin infinite 10s linear;
  :hover {
    animation-duration: 3s;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
function SearchBar({ initialKeyword = '' }: any) {
  const history = useHistory();
  const [keyword, setKeyword] = useState(initialKeyword);

  const handleKeywordChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setKeyword(value);
  };

  const onSearch = (e: any) => {
    e.preventDefault();
    history.push(`/search?keyword=${keyword}`);
  };
  return (
    <Container>
      <SearchInput value={keyword} placeholder="가수 이름 / 노래 제목으로 검색해보세요!" onChange={handleKeywordChange} />
      <SearchButton type="submit" onClick={onSearch}>
        <Logo src={logo} alt="searchButton" />
      </SearchButton>
    </Container>
  );
}

export default SearchBar;
