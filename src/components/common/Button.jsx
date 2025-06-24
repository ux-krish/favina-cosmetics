import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  background: #222;
  color: #fff;
  padding: 7px 14px;
  border-radius: 5px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 100;
  transition: opacity 0.18s, transform 0.18s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
`;

const baseStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 4px;
  font-weight: 500;
  font-size: ${(props) => (props.$small ? '14px' : '16px')};
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
  background-color: ${(props) => (props.$variant === 'outline' ? 'transparent' : '#333')};
  color: ${(props) => (props.$variant === 'outline' ? '#333' : 'white')};
  border: ${(props) => (props.$variant === 'outline' ? '1px solid #333' : 'none')};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$variant === 'outline' ? '#f5f5f5' : '#555')};
  }
`;

const StyledLink = styled(Link)`
  ${baseStyles}
  background-color: ${(props) => (props.$variant === 'outline' ? 'transparent' : '#333')};
  color: ${(props) => (props.$variant === 'outline' ? '#333' : 'white')};
  border: ${(props) => (props.$variant === 'outline' ? '1px solid #333' : 'none')};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$variant === 'outline' ? '#f5f5f5' : '#555')};
  }
`;

export default Button;