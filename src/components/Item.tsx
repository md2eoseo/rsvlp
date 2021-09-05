import styled from 'styled-components';

type ContainerProps = {
  outOfStock: boolean;
};

const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 245px;
  transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
  :hover {
    transform: scale(1.05);

    .Image {
      ${props => props.outOfStock && { filter: 'blur(4px)' }}
    }

    .OutOfStock {
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  width: 100%;
`;

const Info = styled.div`
  color: white;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
`;

type FieldProps = {
  fontSize?: number;
};

const Field = styled.p<FieldProps>(props => ({
  fontSize: props.fontSize || 16 + 'px',
}));

const OutOfStock = styled.div`
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 245px;
  line-height: 245px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
`;

function Item({ shop, name, price, outOfStock, imgUrl, url }: any) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <Container outOfStock={outOfStock}>
        <Image className="Image" src={imgUrl} alt="imgUrl" />
        {outOfStock && <OutOfStock className="OutOfStock">품절</OutOfStock>}
        <Info>
          <Field style={{ marginBottom: '8px' }}>{name}</Field>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Field>{price}</Field>
            <Field>{shop}</Field>
          </div>
        </Info>
      </Container>
    </a>
  );
}

export default Item;
