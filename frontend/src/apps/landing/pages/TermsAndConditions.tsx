import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Shield, FileText, Users, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const TermsAndConditions: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'legal-framework',
      title: '1. LEGAL BASIS AND ENFORCEABILITY',
      icon: <Scale className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">1.1 Contract Formation</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            By accessing, browsing, registering on, or using this Platform in any manner, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms. Your continued use of the Platform constitutes acceptance of any 
            modifications to these Terms. This Agreement forms a valid contract under Section 10 of the Indian Contract Act, 1872.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">1.2 Capacity to Contract</h3>
          <p className="mb-2 text-gray-700">You represent and warrant that:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>You are at least 18 years of age or have attained majority under applicable law</li>
            <li>You possess the legal capacity and authority to enter into this Agreement under Section 11 of the Indian Contract Act, 1872</li>
            <li>If acting on behalf of an entity, you are duly authorized to bind such entity</li>
            <li>Your agreement to these Terms is made with free consent as defined under Section 14 of the Indian Contract Act, 1872</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">1.3 Compliance Framework</h3>
          <p className="mb-2 text-gray-700">This Agreement ensures compliance with:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Information Technology Act, 2000 and IT Rules, 2021</li>
            <li>Digital Personal Data Protection Act, 2023</li>
            <li>Consumer Protection Act, 2019 and E-commerce Rules, 2020</li>
            <li>Foreign Exchange Management Act, 1999 (for international transactions)</li>
            <li>Apprentices Act, 1961 (where applicable to training programs)</li>
            <li>Companies Act, 2013</li>
            <li>Indian Copyright Act, 1957</li>
            <li>Trade Marks Act, 1999</li>
          </ul>
        </>
      ),
    },
    {
      id: 'definitions',
      title: '2. DEFINITIONS AND INTERPRETATIONS',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-3 text-gray-700 leading-relaxed">
            <strong className="text-[#004F4D]">Applicant/Intern:</strong> Any individual seeking to apply for or participate 
            in internship opportunities through the Platform.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            <strong className="text-[#004F4D]">Employer/Organization:</strong> Any entity, individual, or organization posting 
            internship opportunities or seeking interns through the Platform.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            <strong className="text-[#004F4D]">Content:</strong> All information, data, text, software, sound, photographs, 
            graphics, video, messages, or other materials accessible through the Platform.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            <strong className="text-[#004F4D]">Personal Data:</strong> Has the meaning assigned under the Digital Personal 
            Data Protection Act, 2023.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            <strong className="text-[#004F4D]">Intermediary:</strong> Any person who receives, stores, or transmits electronic 
            records on behalf of another person, as defined under Section 2(w) of the IT Act, 2000.
          </p>
          <p className="mb-3 text-gray-700 leading-relaxed">
            <strong className="text-[#004F4D]">Services:</strong> All services provided through the Platform including but not 
            limited to internship listings, applications, communications, and related features.
          </p>
        </>
      ),
    },
    {
      id: 'intermediary',
      title: '3. PLATFORM OPERATION AND INTERMEDIARY STATUS',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">3.1 Intermediary Role</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            ITPL operates as an intermediary under Section 2(w) of the Information Technology Act, 2000, facilitating connections 
            between Employers and Applicants. We do not directly participate in the employment relationship or guarantee any 
            outcomes from internship placements.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">3.2 Safe Harbor Provisions</h3>
          <p className="mb-2 text-gray-700">ITPL seeks protection under Section 79 of the IT Act, 2000. We are not liable for:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Information posted by Employers or Applicants</li>
            <li>Actions or omissions of platform users</li>
            <li>Accuracy of internship descriptions or applicant profiles</li>
            <li>Employment decisions made by organizations</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">3.3 Due Diligence Obligations</h3>
          <p className="mb-2 text-gray-700">In compliance with IT Rules, 2021, we maintain:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Reasonable efforts to prevent unlawful content</li>
            <li>Grievance redressal mechanism</li>
            <li>User verification processes where required</li>
            <li>Content moderation systems</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-protection',
      title: '4. DATA PROTECTION AND PRIVACY COMPLIANCE',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">4.1 DPDP Act Compliance</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            As a Data Fiduciary under the Digital Personal Data Protection Act, 2023, ITPL ensures:
          </p>

          <h4 className="text-lg font-semibold text-[#1F7368] mt-3 mb-2">Lawful Processing:</h4>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Processing personal data only for specified, explicit, and legitimate purposes</li>
            <li>Ensuring data minimization - collecting only necessary data</li>
            <li>Obtaining valid consent before processing personal data</li>
            <li>Providing clear privacy notices in English and local languages</li>
          </ul>

          <h4 className="text-lg font-semibold text-[#1F7368] mt-3 mb-2">Consent Management:</h4>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Free, specific, informed, and unconditional consent</li>
            <li>Easy withdrawal mechanism for consent</li>
            <li>Separate consent for different processing activities</li>
            <li>Age verification for users under 18 years</li>
          </ul>

          <h4 className="text-lg font-semibold text-[#1F7368] mt-3 mb-2">Data Subject Rights:</h4>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Right to access personal data</li>
            <li>Right to correction and deletion</li>
            <li>Right to data portability</li>
            <li>Right to grievance redressal</li>
          </ul>

          <h4 className="text-lg font-semibold text-[#1F7368] mt-3 mb-2">Data Security:</h4>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Appropriate technical and organizational measures</li>
            <li>Regular security audits and assessments</li>
            <li>Breach notification to Data Protection Board within prescribed timelines</li>
            <li>Data retention policies and secure deletion procedures</li>
          </ul>
        </>
      ),
    },
    {
      id: 'registration',
      title: '5. REGISTRATION AND ACCOUNT MANAGEMENT',
      icon: <Users className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">5.1 Account Creation</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Users must provide accurate, current, and complete information during registration. False information may result 
            in account suspension or termination.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">5.2 Account Security</h3>
          <p className="mb-2 text-gray-700">Users are responsible for:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Maintaining confidentiality of login credentials</li>
            <li>All activities under their account</li>
            <li>Immediately reporting unauthorized access</li>
            <li>Regular password updates and security maintenance</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">5.3 Verification Requirements</h3>
          <p className="mb-2 text-gray-700">We may require identity verification through:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Government-issued ID documents</li>
            <li>Educational certificates</li>
            <li>Professional credentials</li>
            <li>Phone/email verification</li>
            <li>Video verification calls</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">5.4 Account Suspension/Termination</h3>
          <p className="mb-2 text-gray-700">We reserve the right to suspend or terminate accounts for:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Violation of these Terms</li>
            <li>Fraudulent or misleading information</li>
            <li>Inappropriate conduct</li>
            <li>Legal or regulatory requirements</li>
            <li>Suspected security breaches</li>
          </ul>
        </>
      ),
    },
    {
      id: 'pricing',
      title: '6. PRICING AND PAYMENT TERMS',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">6.1 Service Plans</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Current pricing structure is subject to periodic review and modification with 30 days' notice.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">6.2 Payment Processing</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>All payments in Indian Rupees (INR)</li>
            <li>Secure payment gateways compliant with RBI guidelines</li>
            <li>GST applicable as per Indian tax laws</li>
            <li>Auto-renewal with opt-out provisions</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">6.3 Refund Policy</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Refunds processed within 7-14 business days</li>
            <li>Cooling-off period for premium subscriptions (48 hours)</li>
            <li>Pro-rata refunds for annual plans upon justified cancellation</li>
            <li>Dispute resolution through consumer forums as per Consumer Protection Act, 2019</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">6.4 Foreign Exchange Compliance</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            For international users, payments subject to FEMA regulations and RBI guidelines on current account transactions.
          </p>
        </>
      ),
    },
    {
      id: 'employer-obligations',
      title: '7. EMPLOYER OBLIGATIONS AND COMPLIANCE',
      icon: <Users className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">7.1 Legal Authorization</h3>
          <p className="mb-2 text-gray-700">Employers must possess:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Valid business registration/incorporation</li>
            <li>Authority to recruit interns</li>
            <li>Compliance with labor laws and regulations</li>
            <li>Appropriate licenses/permits for business operations</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">7.2 Internship Standards</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Minimum stipend compliance (Rs. 2,000/month in-office, Rs. 1,000/month remote)</li>
            <li>Clear job descriptions and learning objectives</li>
            <li>Safe working conditions and environment</li>
            <li>Compliance with Apprentices Act, 1961 where applicable</li>
            <li>Non-discrimination policies</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">7.3 Prohibited Practices</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Charging fees from applicants</li>
            <li>Misleading job descriptions</li>
            <li>Exploitative working conditions</li>
            <li>Discrimination based on protected characteristics</li>
            <li>Collection of excessive personal documents</li>
            <li>Bait-and-switch tactics</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">7.4 Data Protection Obligations</h3>
          <p className="mb-2 text-gray-700">Employers must:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Use applicant data only for recruitment purposes</li>
            <li>Implement appropriate security measures</li>
            <li>Obtain consent for data processing</li>
            <li>Comply with data retention policies</li>
            <li>Not share data with unauthorized third parties</li>
          </ul>
        </>
      ),
    },
    {
      id: 'applicant-rights',
      title: '8. APPLICANT/INTERN RIGHTS AND RESPONSIBILITIES',
      icon: <Users className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">8.1 Rights</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Fair and transparent selection process</li>
            <li>Safe and conducive learning environment</li>
            <li>Timely payment of stipend as agreed</li>
            <li>Access to learning resources and mentorship</li>
            <li>Protection from exploitation and harassment</li>
            <li>Privacy and data protection</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">8.2 Responsibilities</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Provide accurate and truthful information</li>
            <li>Maintain professional conduct</li>
            <li>Respond to communications promptly</li>
            <li>Honor internship commitments</li>
            <li>Respect confidentiality requirements</li>
            <li>Comply with organization policies</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">8.3 Safety Measures</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Report any inappropriate behavior, exploitation, or safety concerns through our grievance mechanism.
          </p>
        </>
      ),
    },
    {
      id: 'intellectual-property',
      title: '9. INTELLECTUAL PROPERTY PROTECTION',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">9.1 Platform IP</h3>
          <p className="mb-2 text-gray-700">
            All content, trademarks, copyrights, patents, and proprietary information on the Platform belong to ITPL and are 
            protected under:
          </p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Copyright Act, 1957</li>
            <li>Trade Marks Act, 1999</li>
            <li>Designs Act, 2000</li>
            <li>Patents Act, 1970</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">9.2 User-Generated Content</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Users retain ownership of their original content but grant ITPL a non-exclusive, worldwide license to use, display, 
            and distribute such content for platform operations.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">9.3 Infringement Claims</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We maintain a DMCA-compliant takedown procedure for intellectual property violations.
          </p>
        </>
      ),
    },
    {
      id: 'grievance',
      title: '10. GRIEVANCE REDRESSAL MECHANISM',
      icon: <AlertCircle className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">10.1 Multi-Tier Redressal</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Level 1: Automated support system</li>
            <li>Level 2: Customer service team resolution (24-48 hours)</li>
            <li>Level 3: Escalation to grievance officer (3-5 business days)</li>
            <li>Level 4: External mediation/arbitration</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">10.2 Grievance Officer</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-gray-700 mb-1">Email: grievance@i-intern.com</p>
            <p className="text-gray-700 mb-1">Response Time: 72 hours for acknowledgment</p>
            <p className="text-gray-700">Resolution Time: 15 days</p>
          </div>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">10.3 Consumer Protection</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Users may approach consumer forums under the Consumer Protection Act, 2019, for disputes involving deficient services.
          </p>
        </>
      ),
    },
    {
      id: 'liability',
      title: '11. LIMITATION OF LIABILITY AND DISCLAIMERS',
      icon: <AlertCircle className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">11.1 Service Disclaimer</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            The Platform is provided "as is" without warranties of any kind. We disclaim all express or implied warranties 
            including merchantability, fitness for purpose, and non-infringement.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">11.2 Liability Limitations</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Our liability is limited to the maximum amount paid by the user in the 12 months preceding the claim, subject to 
            applicable law.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">11.3 Force Majeure</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            We are not liable for delays or failures due to circumstances beyond reasonable control including natural disasters, 
            government actions, or technical failures.
          </p>
        </>
      ),
    },
    {
      id: 'dispute-resolution',
      title: '12. JURISDICTIONAL AND DISPUTE RESOLUTION',
      icon: <Scale className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">12.1 Governing Law</h3>
          <p className="mb-2 text-gray-700">This Agreement is governed by the laws of India, specifically:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Indian Contract Act, 1872</li>
            <li>Information Technology Act, 2000</li>
            <li>Consumer Protection Act, 2019</li>
            <li>Other applicable central and state laws</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">12.2 Jurisdiction</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Courts in Coimbatore, Tamil Nadu, shall have exclusive jurisdiction over disputes arising from this Agreement.
          </p>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">12.3 Arbitration</h3>
          <p className="mb-2 text-gray-700">Disputes may be resolved through arbitration under the Arbitration and Conciliation Act, 2015:</p>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Single arbitrator appointed by mutual consent</li>
            <li>Seat of arbitration: Coimbatore</li>
            <li>Language: English</li>
            <li>Expedited procedure for claims under Rs. 1 crore</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">12.4 Mediation</h3>
          <p className="mb-3 text-gray-700 leading-relaxed">
            Parties may opt for mediation through recognized mediation centers before initiating formal legal proceedings.
          </p>
        </>
      ),
    },
    {
      id: 'cybersecurity',
      title: '13. CYBERSECURITY AND TECHNICAL SAFEGUARDS',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <>
          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">13.1 Security Measures</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>SSL encryption for data transmission</li>
            <li>Regular security audits and penetration testing</li>
            <li>Multi-factor authentication options</li>
            <li>Secure data storage and backup systems</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">13.2 Incident Response</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>24/7 security monitoring</li>
            <li>Incident response team and procedures</li>
            <li>User notification protocols</li>
            <li>Cooperation with law enforcement</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#004F4D] mt-4 mb-2">13.3 Business Continuity</h3>
          <ul className="list-disc ml-6 mb-3 text-gray-700 space-y-1">
            <li>Disaster recovery plans</li>
            <li>Data backup and restoration procedures</li>
            <li>Service availability commitments</li>
            <li>Alternative access methods</li>
          </ul>
        </>
      ),
    },
    {
      id: 'contact',
      title: '14. CONTACT INFORMATION',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <>
          <div className="bg-[#F0F9F8] p-6 rounded-xl mb-4">
            <h3 className="text-xl font-semibold text-[#004F4D] mb-3">Registered Office</h3>
            <p className="text-gray-700 mb-2">I-Intern Technologies Private Limited</p>
            <p className="text-gray-700 mb-1">Email: legal@i-intern.com</p>
          </div>

          <div className="bg-[#F0F9F8] p-6 rounded-xl mb-4">
            <h3 className="text-xl font-semibold text-[#004F4D] mb-3">Grievance Officer</h3>
            <p className="text-gray-700 mb-1">Email: grievance@i-intern.com</p>
          </div>

          <div className="bg-[#F0F9F8] p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-[#004F4D] mb-3">Data Protection Officer</h3>
            <p className="text-gray-700 mb-1">Email: dpo@i-intern.com</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#F0F9F8] to-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#63D7C7]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B3EDEB]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-all hover:gap-3 duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <span className="text-[#B3EDEB] font-semibold text-sm">Legal Agreement</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Terms & Conditions
            </h1>
            <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
              Please read these terms carefully before using the I-Intern platform
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-white/80">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Last Updated: October 9, 2025</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preamble */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-[#F0F9F8] rounded-3xl shadow-xl p-10 mb-10 border border-[#B3EDEB]/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1F7368] to-[#004F4D] rounded-2xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#004F4D]">Preamble and Legal Framework</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              Welcome to <span className="font-bold text-[#1F7368]">i-intern.com</span> (hereinafter referred to as the "Site," "Platform," or "I-Intern" 
              interchangeably), a comprehensive internship facilitation portal operated by <span className="font-bold text-[#1F7368]">I-Intern Technologies 
              Private Limited</span> (hereinafter referred to as "ITPL," "Company," "we," "us," or "our"), a company 
              incorporated under the Companies Act, 2013.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              These Terms and Conditions of Use ("Terms," "Agreement," or "T&C") constitute a legally binding agreement 
              between you ("User," "you," or "your") and ITPL, governing your access to and use of our platform, services, 
              and related offerings. This Agreement is formulated in compliance with the Indian Contract Act, 1872, 
              Information Technology Act, 2000, Consumer Protection Act, 2019, Digital Personal Data Protection Act, 2023, 
              and all other applicable laws of India.
            </p>
          </div>

          <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#63D7C7]/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-[#1F7368] flex-shrink-0 mt-1" />
              <p className="text-gray-800 leading-relaxed">
                <span className="font-semibold text-[#004F4D]">Important Notice:</span> By accessing or using this platform, 
                you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="bg-gradient-to-br from-white to-[#FFFAF3] rounded-3xl shadow-xl p-10 mb-8 border border-[#B3EDEB]/30 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-2xl flex items-center justify-center text-white shadow-lg">
                {section.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004F4D] leading-tight">{section.title}</h2>
              </div>
            </div>
            <div className="ml-0 md:ml-18 space-y-4">{section.content}</div>
          </motion.div>
        ))}

        {/* Acknowledgment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#004F4D] via-[#1F7368] to-[#004F4D] rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#63D7C7]/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Effective Date and Acknowledgment</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="leading-relaxed text-lg">
                <span className="font-bold text-[#B3EDEB]">Effective Date:</span> October 9, 2025
              </p>
              <p className="leading-relaxed text-lg">
                By using this Platform, you acknowledge that you have read, understood, and agree to be bound by these 
                comprehensive Terms and Conditions.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#63D7C7] rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-[#004F4D]" />
                </div>
                <div>
                  <p className="font-bold text-xl mb-2 text-[#B3EDEB]">ACKNOWLEDGMENT</p>
                  <p className="text-white/90 leading-relaxed">
                    I acknowledge that I have read and understood these Terms and Conditions and agree to be bound by them. 
                    I understand that my continued use of the platform constitutes acceptance of these terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1F7368] to-[#004F4D] text-white px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Home Page
          </Link>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default TermsAndConditions;
