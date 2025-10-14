import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  PricingContainer,
  PricingHeader,
  MainTitle,
  ToggleContainer,
  ToggleButton,
  ContentContainer,
  InternPricingTable,
  InternPricingCard,
  Badge,
  InternPlanName,
  InternPlanPrice,
  InternFeatureList,
  InternFeatureItem,
  CompanyPlansWrapper,
  CompanyPlanCard,
  CompanyPlanName,
  CompanyPlanPrice,
  CompanyPlanDetails,
  CompanyPlanDetailItem,
  SelectButton
} from '../components/sharedStyled';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Mail,
  Percent,
  Unlock,
  Ban,
  Sparkle,
  BarChart,
  Pin,
  Star,
  FileText,
  Users,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  Infinity
} from 'lucide-react';

// Types
type PricingMode = 'intern' | 'company';

interface PricingFeature {
  icon: React.ReactNode;
  text: string;
}

interface PlanFeature {
  text: string;
  icon: React.ReactNode;
}

interface CompanyPlan {
  name: string;
  price: string;
  features: {
    limits: PlanFeature[];
    benefits: PlanFeature[];
  };
  highlight: boolean;
}

const PricingPage: React.FC = () => {
  const [pricingMode, setPricingMode] = useState<PricingMode>('intern');
  const [searchParams] = useSearchParams();

  // Handle URL parameters on component mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'company') {
      setPricingMode('company');
    } else if (typeParam === 'intern') {
      setPricingMode('intern');
    }
  }, [searchParams]);

  // Updated icon colors for a cohesive theme
  const primaryIconColor = "#1F7368";   // Deep Teal
  const secondaryIconColor = "#63D7C7"; // Aqua Mint for accents on dark bg

  const freePlanFeatures: PricingFeature[] = [
    { icon: <CreditCard size={18} color={primaryIconColor} />, text: "5 credits/month (reset on 1st)" },
    { icon: <Mail size={18} color={primaryIconColor} />, text: "1 credit = 1 internship application" },
    { icon: <Percent size={18} color={primaryIconColor} />, text: "10%–20% success fee on paid internships" }
  ];

  const premiumPlanFeatures: PricingFeature[] = [
    { icon: <Unlock size={18} color={primaryIconColor} />, text: "Unlimited internship applications" },
    { icon: <Ban size={18} color={primaryIconColor} />, text: "No success fee on stipend" },
    { icon: <Sparkle size={18} color={secondaryIconColor} />, text: "AI-powered resume builder" },
    { icon: <BarChart size={18} color={secondaryIconColor} />, text: "Personalized skill assessments" },
    { icon: <Pin size={18} color={secondaryIconColor} />, text: "Priority placement in searches" },
    { icon: <Star size={18} color={secondaryIconColor} />, text: "Access to premium opportunities" }
  ];

  const companyPlans: CompanyPlan[] = [
    {
      name: "Genesis",
      price: "₹699/month",
      features: {
        limits: [
          { text: "5 postings/month", icon: <FileText size={18} /> },
          { text: "30 profile views/month", icon: <Users size={18} /> },
        ],
        benefits: [
          { text: "Verified Employer Badge", icon: <BadgeCheck size={18} /> },
          { text: "Affordable for growing startups", icon: <Star size={18} /> },
          { text: "Save on annual plan", icon: <TrendingUp size={18} /> },
        ],
      },
      highlight: false,
    },
    {
      name: "Ascend",
      price: "₹1,499/month",
      features: {
        limits: [
          { text: "15 postings/month", icon: <FileText size={18} /> },
          { text: "150 profile views/month", icon: <Users size={18} /> },
        ],
        benefits: [
          { text: "Perfect for scaling recruitment", icon: <Star size={18} /> },
          { text: "Multi-department hiring", icon: <Users size={18} /> },
          { text: "Save on annual plan", icon: <TrendingUp size={18} /> },
        ],
      },
      highlight: true,
    },
    {
      name: "Titan",
      price: "₹4,999/month",
      features: {
        limits: [
          { text: "Unlimited postings", icon: <Infinity size={18} /> },
          { text: "Unlimited profile views", icon: <Infinity size={18} /> },
        ],
        benefits: [
          { text: "Full hiring freedom", icon: <ShieldCheck size={18} /> },
          { text: "For high-volume recruitment", icon: <Star size={18} /> },
          { text: "Save on annual plan", icon: <TrendingUp size={18} /> },
        ],
      },
      highlight: false,
    },
  ];

  const renderInternPricing = () => (
    <InternPricingTable>
      <InternPricingCard>
        <InternPlanName>Free Plan</InternPlanName>
        <InternPlanPrice>₹0/month</InternPlanPrice>
        <InternFeatureList>
          {freePlanFeatures.map((feature, index) => (
            <InternFeatureItem key={index}>
              {feature.icon}
              <span>{feature.text}</span>
            </InternFeatureItem>
          ))}
        </InternFeatureList>
        <SelectButton as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} $free>
          Get Started Free
        </SelectButton>
      </InternPricingCard>

      <InternPricingCard $highlight>
        <Badge>Most Popular</Badge>
        <InternPlanName>Premium Plan</InternPlanName>
        <InternPlanPrice>₹198/month</InternPlanPrice>
        <InternFeatureList>
          {premiumPlanFeatures.map((feature, index) => (
            <InternFeatureItem key={index}>
              {feature.icon}
              <span>{feature.text}</span>
            </InternFeatureItem>
          ))}
        </InternFeatureList>
        <SelectButton as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Upgrade to Premium
        </SelectButton>
      </InternPricingCard>
    </InternPricingTable>
  );

  const renderCompanyPricing = () => (
    <CompanyPlansWrapper>
      {companyPlans.map((plan, index) => (
        <CompanyPlanCard
          key={index}
          $highlight={plan.highlight}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {plan.highlight && <Badge>Most Popular</Badge>}
          <CompanyPlanName $highlight={plan.highlight}>{plan.name}</CompanyPlanName>
          <CompanyPlanPrice $highlight={plan.highlight}>{plan.price}</CompanyPlanPrice>
          <CompanyPlanDetails>
            {[...plan.features.limits, ...plan.features.benefits].map((feature, featureIndex) => (
              <CompanyPlanDetailItem key={featureIndex} $highlight={plan.highlight}>
                {feature.icon}
                <span>{feature.text}</span>
              </CompanyPlanDetailItem>
            ))}
          </CompanyPlanDetails>
          <SelectButton
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            $highlight={plan.highlight}
          >
            Choose {plan.name}
          </SelectButton>
        </CompanyPlanCard>
      ))}
    </CompanyPlansWrapper>
  );

  return (
    <>
      <SEO
        title="Pricing | I-Intern Plans for Students & Employers"
        description="Explore I-Intern's pricing plans for students and employers. Find the perfect plan for your internship or hiring needs."
        url="https://www.i-intern.com/pricing"
        image="https://www.i-intern.com/favicon.svg"
      />
      <Navbar />
      <PricingContainer>
        <PricingHeader>
          <MainTitle>Find the Plan That's Right for You</MainTitle>
          <ToggleContainer>
            <ToggleButton
              as={motion.button}
              $active={pricingMode === 'intern'}
              onClick={() => setPricingMode('intern')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              For Interns
            </ToggleButton>
            <ToggleButton
              as={motion.button}
              $active={pricingMode === 'company'}
              onClick={() => setPricingMode('company')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              For Companies
            </ToggleButton>
          </ToggleContainer>
        </PricingHeader>

        <ContentContainer>
          <motion.div
            key={pricingMode}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {pricingMode === 'intern' ? renderInternPricing() : renderCompanyPricing()}
          </motion.div>
        </ContentContainer>
      </PricingContainer>
      <Footer />
    </>
  );
};

export default PricingPage;


