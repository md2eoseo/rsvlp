import styled from 'styled-components';
import SearchBar from '../components/SearchBar';

const Container = styled.div`
  min-height: 100vh;
  padding: 0 20vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.h1`
  text-align: center;
  font-size: 48px;
  margin-top: 60px;
  margin-bottom: 40px;

  @media (max-width: 1080px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

function Main() {
  return (
    <Container>
      <Logo className="Logo" onMouseDown={e => (e.preventDefault ? e.preventDefault() : false)}>
        한국 레코드샵에서
        <br />
        LP 검색
      </Logo>
      <SearchBar />
    </Container>
  );
}

export default Main;
