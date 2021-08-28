import styled from 'styled-components';
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
  font-size: 1.5rem;
  border: none;
  border-radius: 50vh;
  outline: none;
  ::placeholder {
    font-size: 1.5rem;
  }
  @media (max-width: 800px) {
    height: 32px;
    padding-left: 16px;
    padding-right: 36px;
    font-size: 1rem;
    ::placeholder {
      font-size: 1rem;
    }
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 2px;
  top: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 60px;
  outline: none;
  background-color: transparent;
  @media (max-width: 800px) {
    right: 1px;
    top: 1px;
  }
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  animation: spin infinite 10s linear;
  :hover {
    animation-duration: 3s;
  }
  @media (max-width: 800px) {
    width: 30px;
    height: 30px;
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
  font-size: 1.5rem;
  text-align: center;
  @media (max-width: 800px) {
    font-size: 1rem;
  }
`;

function SearchBar({ initialKeyword = '' }: any) {
  const history = useHistory();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleKeywordChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setKeyword(value);
    setErrorMsg('');
  };

  const onSearch = (e: any) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length > 1) history.push(`/search?keyword=${trimmedKeyword}`);
    else setErrorMsg('검색어는 최소 2자 이상 적어주세요.');
  };
  return (
    <Container>
      <SearchInput value={keyword} placeholder="가수 / 앨범명으로 검색" onChange={handleKeywordChange} />
      <SearchButton type="submit" onClick={onSearch}>
        <Logo src={logo} alt="searchButton" />
      </SearchButton>
      {errorMsg !== '' && <ErrorMsg>{errorMsg}</ErrorMsg>}
    </Container>
  );
}

export default SearchBar;
