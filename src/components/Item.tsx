// SVG Heart Animation by @simeydotme
// https://codepen.io/simeydotme/pen/ZEKrpXa
import { useState } from 'react';
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

    .Heart {
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

type HeartProps = {
  isLiked: boolean;
};

const Heart = styled.div<HeartProps>`
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: ${props => (props.isLiked ? 1 : 0)};
  width: 32px;

  svg use {
    fill: transparent;
    stroke: rgba(255, 255, 255, 0.7);
    stroke-width: 1.2;
    transition: all 0.33s ease;
  }

  svg use:last-child {
    fill: #f43965;
    stroke: #f43965;
    opacity: 0;
    transform: scale(0.33);
    transform-origin: center;
  }

  &.on svg use {
    stroke: transparent;
  }

  &.on svg use:last-child {
    opacity: 1;
    transform: none;
    transition: all 0.5s cubic-bezier(0.19, 2.41, 0.45, 0.94);
  }

  svg {
    overflow: visible !important;
  }

  .hide {
    display: none;
  }
`;

function Item({ shop, name, price, outOfStock, imgUrl, url }: any) {
  const checkLikes = () => {
    const likeUrls = JSON.parse(localStorage.getItem('likes') || '[]').map((like: any) => like.url);
    return likeUrls.includes(url);
  };

  const [isLiked, setIsLiked] = useState(checkLikes);

  const handleClick = (e: any) => {
    let i = 3;
    let isHeart = false;
    let node = e.target;
    while (i--) {
      if (node.classList.contains('Heart')) {
        isHeart = true;
        break;
      }
      node = node.parentNode;
    }
    if (!isHeart) {
      window.open(url);
    } else {
      const likes = JSON.parse(localStorage.getItem('likes') || '[]');
      if (!isLiked) {
        likes.push({ shop, name, price, outOfStock, imgUrl, url });
      } else {
        const removeIndex = likes.findIndex((like: any) => like.url === url);
        likes.splice(removeIndex, 1);
      }
      localStorage.setItem('likes', JSON.stringify(likes));
      setIsLiked(!isLiked);
    }
  };

  return (
    <Container outOfStock={outOfStock} onClick={handleClick}>
      <Image className="Image" src={imgUrl} alt="imgUrl" />
      {outOfStock && <OutOfStock className="OutOfStock">품절</OutOfStock>}
      <Heart className={`Heart ${isLiked && 'on'}`} isLiked={isLiked}>
        <svg viewBox="0 0 24 24">
          <use xlinkHref="#heart" />
          <use xlinkHref="#heart" />
        </svg>
        <svg className="hide" viewBox="0 0 24 24">
          <defs>
            <path
              id="heart"
              d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"
            />
          </defs>
        </svg>
      </Heart>
      <Info>
        <Field style={{ marginBottom: '8px' }}>{name}</Field>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Field>{price}</Field>
          <Field>{shop}</Field>
        </div>
      </Info>
    </Container>
  );
}

export default Item;
