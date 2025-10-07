import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Keyframes for the animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Main container for the pricing page
export const PricingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #004F4D, #1F7368, #004F4D);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 8rem 2rem 4rem;
  color: #FFFAF3; /* Default text color to Cream White */
`;

// Header section containing title and toggle buttons
export const PricingHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

// Main title of the page
export const MainTitle = styled.h1`
  color: #FFFAF3; /* Cream White */
  font-weight: 700;
  margin-bottom: 2rem;
  font-size: 3rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

// Container for the toggle buttons
export const ToggleContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background-color: rgba(24, 28, 25, 0.3); /* Transparent Black */
  padding: 0.5rem;
  border-radius: 50px;
  backdrop-filter: blur(5px);
`;

// Toggle button for switching between intern and company pricing
export const ToggleButton = styled(motion.button)<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${(props) => props.$active ? `
    background: #63D7C7; /* Aqua Mint */
    color: #004F4D; /* Dark Teal */
    box-shadow: 0 4px 15px rgba(99, 215, 199, 0.2);
  ` : `
    background: transparent;
    color: #FFFAF3; /* Cream White */
  `}
`;

// Wrapper for the main content
export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Flex container for intern pricing cards
export const InternPricingTable = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto 4rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

// Card for individual intern pricing plans
export const InternPricingCard = styled.div<{ $highlight?: boolean }>`
  background: #FFFAF3; /* Cream White */
  color: #181C19; /* Black text */
  border-radius: 20px;
  padding: 2.5rem;
  border: 2px solid ${(props) => (props.$highlight ? '#63D7C7' : 'rgba(179, 237, 235, 0.2)')};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 400px;
  
  ${(props) => props.$highlight && `
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(99, 215, 199, 0.3);
  `}

  &:hover {
    transform: translateY(-5px) ${(props) => (props.$highlight ? 'scale(1.08)' : 'scale(1.02)')};
  }
`;

// "Most Popular" badge
export const Badge = styled.div`
  position: absolute;
  top: -15px;
  right: 20px;
  background: #63D7C7; /* Aqua Mint */
  color: #004F4D; /* Dark Teal */
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 700;
`;

// Plan name for intern cards
export const InternPlanName = styled.h2`
  color: #004F4D;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: 1.75rem;
  text-align: center;
`;

// Plan price for intern cards
export const InternPlanPrice = styled.p`
  color: #1F7368;
  font-weight: 800;
  margin-bottom: 2rem;
  font-size: 2.25rem;
  text-align: center;
`;

// Feature list for intern cards
export const InternFeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2.5rem;
`;

export const InternFeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #181C19;
`;

// Grid wrapper for company pricing plans
export const CompanyPlansWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
  align-items: stretch;
`;

// Card for individual company plans
export const CompanyPlanCard = styled(motion.div)<{ $highlight?: boolean }>`
  background: ${(props) => (props.$highlight ? 'linear-gradient(135deg, #FFFAF3 0%, #F0FDFC 100%)' : '#FFFAF3')}; /* Cream White with gradient for highlight */
  color: #181C19;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: ${(props) => (props.$highlight ? '0 12px 40px rgba(99, 215, 199, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)')};
  border: 2px solid ${(props) => (props.$highlight ? '#63D7C7' : 'rgba(179, 237, 235, 0.2)')};
  transition: all 0.3s ease;
  width: 100%;
  position: relative;

  ${(props) => props.$highlight && `
    box-shadow: 0 0 30px rgba(99, 215, 199, 0.3);
    transform: scale(1.05);
    z-index: 1;
  `}

  &:hover {
    transform: translateY(-5px) ${(props) => (props.$highlight ? 'scale(1.07)' : 'scale(1.02)')};
  }
`;

// Plan name for company cards
export const CompanyPlanName = styled.h2<{ $highlight?: boolean }>`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  color: #004F4D;
`;

// Plan price for company cards
export const CompanyPlanPrice = styled.p<{ $highlight?: boolean }>`
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  color: #1F7368;
`;

// Feature list for company cards
export const CompanyPlanDetails = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2.5rem;
`;

export const CompanyPlanDetailItem = styled.li<{ $highlight?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #181C19;
  
  svg {
    flex-shrink: 0;
    color: ${(props) => (props.$highlight ? '#63D7C7' : '#1F7368')} !important;
  }
`;

// Generic select button for all plans
export const SelectButton = styled(motion.button)<{ $highlight?: boolean; $free?: boolean }>`
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${(props) => {
    if (props.$highlight) {
      return `
        background: #63D7C7;
        color: #004F4D;
        &:hover {
          background-color: #B3EDEB;
        }
      `;
    } else if (props.$free) {
      return `
        background: transparent;
        color: #1F7368;
        border: 2px solid #1F7368;
        &:hover {
          background: #B3EDEB;
        }
      `;
    } else {
      return `
        background: #1F7368;
        color: white;
        &:hover {
          background: #004F4D;
        }
      `;
    }
  }}
`;


