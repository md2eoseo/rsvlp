import styled from '@emotion/styled';

const Container = styled.div`
  position: relative;
  padding: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  border: 2px;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 20px;
  @media (max-width: 425px) {
    flex-direction: column;
    margin: 0 20px 20px 20px;
  }
  :hover {
    opacity: 0.8;
  }
`;

const Image = styled.img`
  width: 40%;
  @media (max-width: 425px) {
    width: 100%;
  }
`;

const Info = styled.div`
  margin-left: 20px;
  height: 100%;
  width: 50%;
  @media (max-width: 425px) {
    width: 100%;
  }
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

type FieldProps = {
  fontSize?: number;
};

const Field = styled.p<FieldProps>(props => ({
  fontSize: props.fontSize || 18 + 'px',
}));

const OutOfStockField = styled.p`
  font-size: 18px;
  font-weight: bold;
  position: absolute;

  @media (min-width: 425px) {
    right: 10px;
    top: 10px;
  }
  @media (max-width: 425px) {
    left: 10px;
    bottom: 10px;
  }
`;

const ShopField = styled.p`
  font-size: 14px;
  position: absolute;
  @media (min-width: 425px) {
    right: 10px;
    bottom: 10px;
  }
  @media (max-width: 425px) {
    display: none;
  }
`;

function Item({ shop, name, price, outOfStock, imgUrl, url }: any) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <Container>
        <Image src={imgUrl} alt="imgUrl" />
        <Info>
          <Field fontSize={22}>{name}</Field>
          <Field fontSize={18} style={{ justifyItems: 'flex-end', alignSelf: 'flex-end' }}>
            {price}
          </Field>
          {outOfStock && <OutOfStockField>품절</OutOfStockField>}
          <ShopField>{shop}</ShopField>
        </Info>
      </Container>
    </a>
  );
}

export default Item;
