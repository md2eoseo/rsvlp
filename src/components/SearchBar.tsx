import styled from '@emotion/styled';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import logo from '../logo.svg';

const Container = styled.form`
  position: relative;
  width: 60vw;
  min-width: 280px;
  border-radius: 50vh;
  margin: 20px 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 64px;
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

const ErrorMsg = styled.p`
  margin: 20px auto 0 auto;
  color: white;
  font-size: 32px;
  text-align: center;
`;

function SearchBar({ initialKeyword = '' }: any) {
  const history = useHistory();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [errorMsg, setErrorMsg] = useState<string>();

  const handleKeywordChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setKeyword(value);
    setErrorMsg('');
  };

  const onSearch = (e: any) => {
    e.preventDefault();
    if (keyword.length > 1) history.push(`/search?keyword=${keyword}`);
    else setErrorMsg('검색어는 최소 2자 이상 적어주세요.');
  };
  return (
    <Container>
      <SearchInput value={keyword} placeholder="가수 이름 / 노래 제목으로 검색해보세요!" onChange={handleKeywordChange} />
      <SearchButton type="submit" onClick={onSearch}>
        <Logo src={logo} alt="searchButton" />
      </SearchButton>
      {errorMsg !== '' && <ErrorMsg>{errorMsg}</ErrorMsg>}
    </Container>
  );
}

export default SearchBar;
