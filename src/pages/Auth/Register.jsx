import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../redux/slices/authSlice';
import  FormInput  from '../../components/ui/FormInput';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(register(data))
      .unwrap()
      .then(() => {
        navigate('/account');
      });
  };

  return (
    <Container>
      <FormContainer>
        <h2>Create Account</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormInput
              label="First Name"
              {...formRegister('firstName', { required: 'First name is required' })}
              error={errors.firstName}
            />
            <FormInput
              label="Last Name"
              {...formRegister('lastName', { required: 'Last name is required' })}
              error={errors.lastName}
            />
          </FormGroup>
          
          <FormInput
            label="Email"
            type="email"
            {...formRegister('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email}
          />
          
          <FormInput
            label="Password"
            type="password"
            {...formRegister('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.password}
          />
          
          <FormInput
            label="Confirm Password"
            type="password"
            {...formRegister('confirmPassword', { 
              required: 'Please confirm your password',
              validate: (value) => 
                value === watch('password') || 'Passwords do not match'
            })}
            error={errors.confirmPassword}
          />
          
          <Button type="submit" fullWidth>
            Register
          </Button>
        </Form>
        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 20px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: #ffecec;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;

  a {
    color: #333;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default RegisterPage;