import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle, Mail, Users, FileText } from 'lucide-react';
import LegalLayout from '../components/legal/LegalLayout';
import { Section, Callout, List, FeatureCard, ContactInfo, DataRightsTable } from '../components/legal/LegalSections';

const PrivacyPolicy = () => {
  const sections = [
    { id: 'introduction', title: 'Introduction', icon: <Shield size={16} /> },
    { id: 'data-collection', title: 'Data Collection', icon: <Database size={16} /> },
    { id: 'data-usage', title: 'How We Use Your Data', icon: <Eye size={16} /> },
    { id: 'data-sharing', title: 'Data Sharing', icon: <Users size={16} /> },
    { id: 'security', title: 'Security Measures', icon: <Lock size={16} /> },
    { id: 'user-rights', title: 'Your Rights', icon: <UserCheck size={16} /> },
    { id: 'contact', title: 'Contact Us', icon: <Mail size={16} /> },
  ];

  const dataRights = [
    {
      title: 'Access',
      description: 'Request a copy of your personal data',
      howTo: 'Email privacy@zankoku.com with "Data Access Request" in subject'
    },
    {
      title: 'Correction',
      description: 'Update inaccurate or incomplete personal data',
      howTo: 'Log into your account settings or contact our support team'
    },
    {
      title: 'Deletion',
      description: 'Request deletion of your personal data',
      howTo: 'Submit deletion request through account settings or email us'
    },
    {
      title: 'Portability',
      description: 'Receive your data in a machine-readable format',
      howTo: 'Email privacy@zankoku.com with "Data Portability Request"'
    },
  ];

  const dataTypes = [
    {
      icon: <UserCheck size={20} />,
      title: 'Account Information',
      description: 'Username, email, profile information, and academic details'
    },
    {
      icon: <Database size={20} />,
      title: 'Usage Data',
      description: 'How you interact with our platform, features used, and time spent'
    },
    {
      icon: <Eye size={20} />,
      title: 'Device Data',
      description: 'Browser type, IP address, device information, and cookies'
    },
    {
      icon: <FileText size={20} />,
      title: 'Content Data',
      description: 'Posts, messages, and content you create on our platform'
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your information"
      sections={sections}
    >
      <Section id="introduction" title="Introduction" icon={<Shield size={20} />}>
        <p>
          At Zankoku, we are committed to protecting your privacy and ensuring the security of your personal information. 
          This Privacy Policy explains how we collect, use, and protect your data when you use our anime battle platform and social features.
        </p>
        
        <Callout type="info" title="Our Commitment">
          We believe in transparency and giving you control over your data. This policy is written in plain language to help you understand exactly what happens to your information.
        </Callout>

        <p>
          This policy applies to all users of Zankoku, including students, educators, and visitors to our platform. 
          By using Zankoku, you agree to the collection and use of information as described in this policy.
        </p>
      </Section>

      <Section id="data-collection" title="Data Collection" icon={<Database size={20} />}>
        <p>
          We collect several types of information to provide you with the best possible experience on our platform. 
          Here's what we collect and why:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {dataTypes.map((type, index) => (
            <FeatureCard
              key={index}
              icon={type.icon}
              title={type.title}
              description={type.description}
            />
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Account Information</h3>
        <List
          items={[
            'Username and display name',
            'Email address for account verification',
            'Profile information and preferences',
            'Academic affiliation (if provided)',
            'Avatar and profile customization'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Academic & Usage Data</h3>
        <List
          items={[
            'Battle history and performance statistics',
            'Learning progress and achievements',
            'Interaction patterns with content and other users',
            'Time spent on different features',
            'Device and browser information'
          ]}
        />
      </Section>

      <Section id="data-usage" title="How We Use Your Data" icon={<Eye size={20} />}>
        <p>
          We use your data to provide, maintain, and improve our services. Here are the main ways we use your information:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Service Provision</h3>
        <List
          items={[
            'Create and manage your account',
            'Provide personalized anime battle experiences',
            'Connect you with other users and communities',
            'Deliver relevant content and recommendations',
            'Process transactions and manage virtual currency'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Platform Improvement</h3>
        <List
          items={[
            'Analyze usage patterns to improve features',
            'Develop new functionality based on user needs',
            'Optimize performance and fix bugs',
            'Conduct research to enhance user experience',
            'Ensure platform security and integrity'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Communication</h3>
        <List
          items={[
            'Send important updates about your account',
            'Provide customer support and respond to inquiries',
            'Share relevant platform news and announcements',
            'Deliver personalized content recommendations',
            'Facilitate community interactions'
          ]}
        />

        <Callout type="warning" title="AI Personalization">
          We use AI to personalize your experience, including battle recommendations and content suggestions. You can control personalization settings in your account preferences.
        </Callout>
      </Section>

      <Section id="data-sharing" title="Data Sharing" icon={<Users size={20} />}>
        <p>
          We may share your information with third parties for various business purposes, including selling user data to interested parties.
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Data Monetization</h3>
        <Callout type="warning" title="Data Sales">
          <strong>Important:</strong> Zankoku may sell user information, including personal data, usage patterns, and behavioral analytics to third-party companies for marketing and research purposes.
        </Callout>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>When We Share Information</h3>
        <List
          items={[
            'With service providers who help operate our platform (payment processors, hosting services)',
            'When required by law or to protect our rights and safety',
            'With your explicit consent (such as sharing content with other users)',
            'To third parties who purchase user data for marketing and analytics',
            'Business transfers (mergers, acquisitions) with notice to users',
            'Data brokers and marketing companies who buy user information'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Types of Data We May Sell</h3>
        <List
          items={[
            'Demographic information (age, location, education level)',
            'Usage patterns and platform interaction data',
            'Academic performance and learning analytics',
            'Content preferences and engagement metrics',
            'Behavioral data and user profiles',
            'Aggregated and anonymized user statistics'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Third-Party Services</h3>
        <p>
          We use and share data with trusted third-party services:
        </p>
        <List
          items={[
            'Payment processors for virtual currency transactions',
            'Analytics services to understand platform usage',
            'Email services for communications',
            'Cloud hosting providers for data storage',
            'Security services for threat detection',
            'Data brokers who purchase user information for marketing'
          ]}
        />

        <Callout type="info" title="Your Choices">
          By using Zankoku, you acknowledge and consent to the potential sale of your data to third parties. You may have limited rights to opt out of data sharing in certain jurisdictions.
        </Callout>
      </Section>

      <Section id="security" title="Security Measures" icon={<Lock size={20} />}>
        <p>
          We implement multiple layers of security to protect your information:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Technical Security</h3>
        <List
          items={[
            'End-to-end encryption for sensitive data',
            'Regular security audits and penetration testing',
            'Secure authentication and session management',
            'Limited access to personal data for authorized personnel only',
            'Continuous monitoring for security threats'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Data Protection</h3>
        <List
          items={[
            'Regular data backups and disaster recovery plans',
            'Secure data centers with physical security measures',
            'Data minimization - we only collect what we need',
            'Regular updates to security protocols and systems',
            'Employee training on data protection best practices'
          ]}
        />

        <Callout type="info" title="Your Role in Security">
          Help us keep your account secure by using a strong password, enabling two-factor authentication, and never sharing your login credentials.
        </Callout>
      </Section>

      <Section id="user-rights" title="Your Rights" icon={<UserCheck size={20} />}>
        <p>
          You have several rights regarding your personal data. We make it easy to exercise these rights:
        </p>

        <DataRightsTable rights={dataRights} />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Data Retention</h3>
        <p>
          We retain your data only as long as necessary to provide our services and comply with legal obligations. 
          You can request data deletion at any time through your account settings or by contacting us.
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Cookie Controls</h3>
        <p>
          You can control cookies through your browser settings. Please note that disabling certain cookies may affect your experience on our platform. 
          See our <a href="/cookies" style={{ color: '#3b82f6' }}>Cookie Policy</a> for more information.
        </p>

        <Callout type="warning" title="Account Deletion">
          When you delete your account, we remove your personal information from our active servers. Some data may be retained in backup systems for security and legal compliance purposes.
        </Callout>
      </Section>

      <Section id="contact" title="Contact Us" icon={<Mail size={20} />}>
        <p>
          If you have questions about this Privacy Policy or need to exercise your rights, please contact us:
        </p>

        <ContactInfo
          email="privacy@zankoku.com"
          phone="1-800-ZANKOKU"
          address="123 Anime Street, Tokyo, Japan 100-0001"
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Response Times</h3>
        <List
          items={[
            'Data access requests: Within 30 days',
            'Privacy inquiries: Within 7 business days',
            'Security concerns: Immediately upon receipt',
            'General questions: Within 48 hours'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Updates to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will:
        </p>
        <List
          items={[
            'Post the updated policy on this page',
            'Update the "Last updated" date at the top',
            'Notify users of significant changes via email',
            'Provide a summary of key changes'
          ]}
        />

        <Callout type="info" title="Stay Informed">
          We encourage you to review this policy periodically to stay informed about how we protect your information.
        </Callout>
      </Section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
