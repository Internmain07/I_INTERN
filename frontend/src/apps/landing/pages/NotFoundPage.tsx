import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Compass } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

// Keyframes for the animated gradient background (matching pricing page)
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Container with same gradient as pricing page
const NotFoundContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #004F4D, #1F7368, #004F4D);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 8rem 2rem 4rem;
  color: #FFFAF3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  text-align: center;
`;

const ErrorCode = styled(motion.h1)`
  font-size: 10rem;
  font-weight: 900;
  color: #63D7C7;
  margin: 0;
  line-height: 1;
  text-shadow: 0 0 40px rgba(99, 215, 199, 0.3);
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFFAF3;
  margin: 2rem 0 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ErrorDescription = styled(motion.p)`
  font-size: 1.25rem;
  color: #B3EDEB;
  margin-bottom: 3rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const StyledButton = styled(motion.button)<{ $primary?: boolean }>`
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  
  ${(props) => props.$primary ? `
    background: #63D7C7;
    color: #004F4D;
    box-shadow: 0 4px 15px rgba(99, 215, 199, 0.3);
    
    &:hover {
      background: #B3EDEB;
      box-shadow: 0 6px 20px rgba(99, 215, 199, 0.4);
    }
  ` : `
    background: transparent;
    color: #FFFAF3;
    border: 2px solid #63D7C7;
    
    &:hover {
      background: rgba(99, 215, 199, 0.1);
      border-color: #B3EDEB;
    }
  `}
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.875rem 1.75rem;
  }
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
  opacity: 0.6;
`;

const FloatingIcon = styled(motion.div)`
  color: #63D7C7;
`;

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found | I-Intern"
        description="The page you're looking for doesn't exist. Return to I-Intern homepage to continue your journey."
        url="https://www.i-intern.com/404"
      />
      <Navbar />
      <NotFoundContainer>
        <ContentWrapper>
          <ErrorCode
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            404
          </ErrorCode>
          
          <ErrorTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Oops! Page Not Found
          </ErrorTitle>
          
          <ErrorDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            The page you're looking for seems to have wandered off into the digital wilderness. 
            Don't worry though, we'll help you find your way back!
          </ErrorDescription>
          
          <IconWrapper
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FloatingIcon
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Compass size={48} />
            </FloatingIcon>
          </IconWrapper>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ButtonGroup>
              <Link to="/">
                <StyledButton
                  $primary
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home size={20} />
                  Back to Home
                </StyledButton>
              </Link>
              
              <Link to="/interns/browse">
                <StyledButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={20} />
                  Browse Internships
                </StyledButton>
              </Link>
            </ButtonGroup>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{ marginTop: '3rem' }}
          >
            <Link to="/" style={{ color: '#63D7C7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Or go back to the previous page</span>
            </Link>
          </motion.div>
        </ContentWrapper>
      </NotFoundContainer>
      <Footer />
    </>
  );
};

export default NotFoundPage;
