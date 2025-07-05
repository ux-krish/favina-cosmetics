import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, fontSizes } from '../../assets/styles/theme';

const Button = ({ children, to, variant, fullWidth, small, tooltip, ...props }) => {
  if (to) {
    return (
      <TooltipWrapper>
        <StyledLink to={to} $variant={variant} $fullWidth={fullWidth} $small={small} {...props}>
          {children}
        </StyledLink>
        {tooltip && <Tooltip>{tooltip}</Tooltip>}
      </TooltipWrapper>
    );
  }
  return (
    <TooltipWrapper>
      <StyledButton $variant={variant} $fullWidth={fullWidth} $small={small} {...props}>
        {children}
      </StyledButton>
      {tooltip && <Tooltip>{tooltip}</Tooltip>}
    </TooltipWrapper>
  );
};

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-block;
  &:hover > span,
  &:focus-within > span {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(-8px) scale(1);
  }
`;

const Tooltip = styled.span`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  left: 50%;
  bottom: 110%;
  transform: translateX(-50%) scale(0.98);
  background: ${colors.dark};
  color: ${colors.textLight};
  padding: 7px 14px;
  border-radius: 5px;
  font-size: ${fontSizes.sm};
  white-space: nowrap;
  z-index: 100;
  transition: opacity 0.18s, transform 0.18s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
`;

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 4px;
  font-weight: 500;
  font-size: ${(props) => (props.$small ? fontSizes.sm : fontSizes.base)};
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  text-decoration: none;
  text-align: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StyledButton = styled.button`
  ${baseStyles}
  background-color: ${(props) => (props.$variant === 'outline' ? 'transparent' : colors.dark)};
  color: ${(props) => (props.$variant === 'outline' ? colors.dark : colors.textLight)};
  border: ${(props) => (props.$variant === 'outline' ? `1px solid ${colors.dark}` : 'none')};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$variant === 'outline' ? colors.background : '#555')};
  }
`;

const StyledLink = styled(Link)`
  ${baseStyles}
  background-color: ${(props) => (props.$variant === 'outline' ? 'transparent' : colors.dark)};
  color: ${(props) => (props.$variant === 'outline' ? colors.dark : colors.textLight)};
  border: ${(props) => (props.$variant === 'outline' ? `1px solid ${colors.dark}` : 'none')};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$variant === 'outline' ? colors.background : '#555')};
  }
`;

export default Button;