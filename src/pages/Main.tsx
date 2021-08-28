import styled from 'styled-components';
import SearchBar from '../components/SearchBar';

const Container = styled.div`
  min-height: 100vh;
  padding: 0 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function Main() {
  return (
    <Container>
      <SearchBar />
    </Container>
  );
}

export default Main;
