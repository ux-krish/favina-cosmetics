import styled from 'styled-components';
import Button from './Button';

const PromoBanner = ({
  image,
  titlePink = "Limited Edition",
  titlePurple = "Unlimited Glam",
  desc = "Unveil your beauty with our exclusive launch offer on premium nail polish shades.",
  offerLabel = "Flat",
  offerHighlight = "30% OFF",
  sub = (
    <>
      on your first purchase<br />
      for the next <BannerHighlight>24 hours</BannerHighlight> only!
    </>
  ),
  buttonText = "Shop Now",
  buttonTo = "/products"
}) => (
  <BannerWrapper>
    <Banner>
      <BannerImage src={image} alt={`${titlePink} ${titlePurple}`} />
      <BannerContent>
        <BannerTitle>
          <BannerTitlePink>{titlePink}</BannerTitlePink>
          <BannerTitlePurple>{titlePurple}</BannerTitlePurple>
        </BannerTitle>
        <BannerDesc>{desc}</BannerDesc>
        <BannerOffer>
          <BannerOfferLabel>{offerLabel}</BannerOfferLabel>
          <BannerOfferHighlight>{offerHighlight}</BannerOfferHighlight>
        </BannerOffer>
        <BannerSub>{sub}</BannerSub>
        <BannerButton to={buttonTo}>{buttonText}</BannerButton>
      </BannerContent>
    </Banner>
  </BannerWrapper>
);

const BannerWrapper = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto 40px auto;
`;

const Banner = styled.div`
  width: 100%;
  display: flex;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 18px rgba(0,0,0,0.06);
  overflow: hidden;
  min-height: 380px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`;

const BannerImage = styled.img`
  flex: 1;
  min-width: 320px;
  object-fit: cover;
  background: #f9f9f9;
  @media (max-width: 900px) {
    width: 100%;
    height: 180px;
    min-width: 0;
  }
`;

const BannerContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 48px 48px 48px;
  background: #fff;
  /* Add a soft, decorative background image (adjust the URL as needed) */
  background-image: url('/assets/images/txt-bg1.png');
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 320px auto;
  @media (max-width: 900px) {
    padding: 28px 18px;
    background-size: 180px auto;
  }
`;

const BannerTitle = styled.div`
  font-size: 2.3rem;
  font-weight: 900;
  margin-bottom: 10px;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  gap: 0;
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const BannerTitlePink = styled.span`
  color: #e5a6a6;
  font-weight: 900;
  font-family: 'Montserrat', sans-serif;
`;

const BannerTitlePurple = styled.span`
  color: #b49be0;
  font-weight: 900;
  margin-top: -2px;
`;

const BannerDesc = styled.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 18px;
  max-width: 480px;
  font-weight: 400;
`;

const BannerOffer = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: #222;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BannerOfferLabel = styled.span`
  font-weight: 900;
  color: #222;
`;

const BannerOfferHighlight = styled.span`
  color: #e5a6a6;
  font-weight: 900;
  margin-left: 8px;
`;

const BannerSub = styled.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 22px;
  b {
    color: #222;
    font-weight: 700;
  }
`;

const BannerHighlight = styled.span`
  color: #b49be0;
  font-weight: 700;
`;

const BannerButton = styled(Button)`
  margin-top: 18px;
  min-width: 140px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 7px;
  background: #fff;
  color: #5b4a44;
  border: 1.5px solid #e5a6a6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  &:hover {
    background: #f7f7f7;
    color: #e5a6a6;
    border-color: #e5a6a6;
  }
`;

export { BannerHighlight };
export default PromoBanner;
