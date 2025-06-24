import styled from 'styled-components';

const FormInput = ({ label, error, ...props }) => {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <Input {...props} />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const ErrorMessage = styled.span`
  color: #ff6b6b;
  font-size: 12px;
`;

export default FormInput;