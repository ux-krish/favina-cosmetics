import styled from 'styled-components';
import { useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send form data to backend here
  };

  return (
    <Container>
      <ContentWrapper>
        <FormSection>
          <h1>Contact Us</h1>
          <Description>
            We'd love to hear from you! Fill out the form below and we'll get back to you soon.
          </Description>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
            />
            <Button type="submit">Send Message</Button>
            {submitted && <SuccessMsg>Thank you for contacting us!</SuccessMsg>}
          </Form>
        </FormSection>
        <MapSection>
          <MapIframe
            title="ShopEase Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019019228767!2d-122.41941518468153!3d37.7749297797597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7e6b1b0b%3A0x4a0f0e4d9e8e8e8e!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </MapSection>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  padding: 30px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const MapSection = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapIframe = styled.iframe`
  width: 100%;
  min-height: 350px;
  border: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 25px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
`;

const Textarea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  min-height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #c0392b;
  }
`;

const SuccessMsg = styled.div`
  color: #27ae60;
  margin-top: 10px;
  text-align: center;
`;

export default ContactPage;
