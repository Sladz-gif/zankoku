import { FileText, AlertTriangle, Shield, Users, Coins, Gavel, CheckCircle, XCircle, Zap, Lock } from 'lucide-react';
import LegalLayout from '../components/legal/LegalLayout';
import { Section, Callout, List, FeatureCard, ContactInfo } from '../components/legal/LegalSections';

const TermsOfService = () => {
  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: <FileText size={16} /> },
    { id: 'eligibility', title: 'Eligibility', icon: <Users size={16} /> },
    { id: 'account-responsibility', title: 'Account Responsibility', icon: <Shield size={16} /> },
    { id: 'platform-usage', title: 'Platform Usage Rules', icon: <Gavel size={16} /> },
    { id: 'academic-integrity', title: 'Academic Integrity', icon: <CheckCircle size={16} /> },
    { id: 'content-ownership', title: 'Content Ownership', icon: <Lock size={16} /> },
    { id: 'premium-features', title: 'Premium Features', icon: <Coins size={16} /> },
    { id: 'termination', title: 'Termination', icon: <XCircle size={16} /> },
    { id: 'liability', title: 'Limitation of Liability', icon: <AlertTriangle size={16} /> },
    { id: 'updates', title: 'Updates to Terms', icon: <Zap size={16} /> },
  ];

  const prohibitedActivities = [
    'Using cheats, hacks, or third-party software to gain unfair advantages',
    'Exploiting bugs or glitches for personal gain',
    'Harassment, hate speech, or discriminatory behavior',
    'Sharing inappropriate or offensive content',
    'Impersonating other users or staff members',
    'Real-money trading of accounts or in-game items',
    'Spamming or disrupting platform functionality',
    'Violating intellectual property rights',
    'Engaging in illegal activities',
    'Attempting to compromise platform security'
  ];

  const userRights = [
    {
      icon: <CheckCircle size={20} />,
      title: 'Content Ownership',
      description: 'You retain ownership of content you create on our platform'
    },
    {
      icon: <Shield size={20} />,
      title: 'Account Security',
      description: 'You have the right to a secure account and data protection'
    },
    {
      icon: <Users size={20} />,
      title: 'Fair Treatment',
      description: 'You have the right to be treated fairly and respectfully'
    },
    {
      icon: <Zap size={20} />,
      title: 'Service Access',
      description: 'You have the right to access the services you\'ve paid for'
    }
  ];

  return (
    <LegalLayout
      title="Terms of Service"
      description="Rules and guidelines for using Zankoku platform"
      sections={sections}
    >
      <Section id="acceptance" title="Acceptance of Terms" icon={<FileText size={20} />}>
        <p>
          By accessing and using Zankoku, you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use our platform.
        </p>
        
        <Callout type="info" title="Agreement">
          These terms constitute a legally binding agreement between you and Zankoku. 
          By creating an account or using our services, you acknowledge that you have read, 
          understood, and agree to be bound by these terms.
        </Callout>

        <p>
          These terms apply to all users of the Zankoku platform, including but not limited to:
        </p>
        <List
          items={[
            'Students and educators',
            'Free and premium users',
            'Content creators and consumers',
            'Community members and participants'
          ]}
        />
      </Section>

      <Section id="eligibility" title="Eligibility" icon={<Users size={20} />}>
        <p>
          To use Zankoku, you must meet the following eligibility requirements:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Age Requirements</h3>
        <List
          items={[
            'You must be at least 13 years of age to create an account',
            'Users under 18 require parental consent for premium features',
            'Users under 16 may have limited access to certain features',
            'We may request age verification at any time'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Other Requirements</h3>
        <List
          items={[
            'You must have the legal capacity to enter into these terms',
            'You must provide accurate and complete registration information',
            'You must not be prohibited from using online services in your jurisdiction',
            'You must comply with all applicable laws and regulations'
          ]}
        />

        <Callout type="warning" title="Student Status">
          While Zankoku is designed for students and educational purposes, it is open to all eligible users who meet our requirements.
        </Callout>
      </Section>

      <Section id="account-responsibility" title="Account Responsibility" icon={<Shield size={20} />}>
        <p>
          You are responsible for maintaining the security and confidentiality of your account:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Security Obligations</h3>
        <List
          items={[
            'Choose a strong, unique password',
            'Enable two-factor authentication when available',
            'Never share your login credentials with others',
            'Log out of shared devices after use',
            'Notify us immediately of any unauthorized access'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Account Usage</h3>
        <List
          items={[
            'One account per person is allowed',
            'You are responsible for all activity on your account',
            'Account sharing is strictly prohibited',
            'You must keep your contact information up to date',
            'You must not create accounts using false information'
          ]}
        />

        <Callout type="error" title="Account Security Breach">
          If you suspect your account has been compromised, contact us immediately at security@zankoku.com. We are not responsible for losses due to account sharing or negligence.
        </Callout>
      </Section>

      <Section id="platform-usage" title="Platform Usage Rules" icon={<Gavel size={20} />}>
        <p>
          When using Zankoku, you agree to follow these rules and guidelines:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Prohibited Activities</h3>
        <List items={prohibitedActivities} />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Acceptable Conduct</h3>
        <List
          items={[
            'Treat other users with respect and courtesy',
            'Contribute positively to the community',
            'Report violations of these terms',
            'Use features as intended and designed',
            'Respect intellectual property rights',
            'Maintain academic integrity in all activities'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Content Standards</h3>
        <List
          items={[
            'All content must be appropriate for all ages',
            'No explicit, violent, or hateful content',
            'No copyrighted material without permission',
            'No misleading or false information',
            'No spam or commercial solicitations'
          ]}
        />
      </Section>

      <Section id="academic-integrity" title="Academic Integrity" icon={<CheckCircle size={20} />}>
        <p>
          Zankoku is committed to maintaining high standards of academic integrity:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>AI Usage Guidelines</h3>
        <Callout type="info" title="AI as a Learning Tool">
          AI tools on Zankoku are designed to assist and enhance learning, not to replace critical thinking or academic work.
        </Callout>

        <List
          items={[
            'AI can be used for learning assistance and guidance',
            'AI-generated content must be properly attributed',
            'AI cannot be used to complete assignments or exams',
            'AI cannot be used to plagiarize or cheat',
            'Users must disclose AI assistance when required by educational institutions'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Cheating Prevention</h3>
        <List
          items={[
            'Unauthorized collaboration is prohibited',
            'Using external resources during timed activities is cheating',
            'Sharing answers or solutions is not allowed',
            'Exploiting system vulnerabilities for academic advantage is forbidden',
            'Any form of academic dishonesty will result in consequences'
          ]}
        />

        <Callout type="warning" title="Educational Partnership">
          We work with educational institutions to ensure our platform supports academic integrity and enhances learning outcomes.
        </Callout>
      </Section>

      <Section id="content-ownership" title="Content Ownership" icon={<Lock size={20} />}>
        <p>
          We respect your intellectual property rights and believe in fair content ownership:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Your Content</h3>
        <List
          items={[
            'You retain ownership of content you create on Zankoku',
            'You grant us a license to use your content to provide the service',
            'You can remove your content at any time',
            'You are responsible for the content you post',
            'You must have the right to share any content you upload'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Platform Content</h3>
        <List
          items={[
            'Zankoku owns the platform, software, and proprietary technology',
            'We own the design, layout, and user interface',
            'We own aggregated data and analytics',
            'Third-party content remains the property of its owners',
            'Open source components remain under their original licenses'
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {userRights.map((right, index) => (
            <FeatureCard
              key={index}
              icon={right.icon}
              title={right.title}
              description={right.description}
            />
          ))}
        </div>
      </Section>

      <Section id="premium-features" title="Premium Features" icon={<Coins size={20} />}>
        <p>
          Zankoku offers premium features and virtual currency for enhanced experiences:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Virtual Currency</h3>
        <Callout type="warning" title="Important Notice">
          All virtual currency (Gold Coins, Silver Coins) has no real-world value and cannot be exchanged for real money or withdrawn.
        </Callout>

        <List
          items={[
            'Virtual currency is licensed, not sold, to users',
            'Purchases are final and non-refundable except as required by law',
            'We reserve the right to modify currency values and pricing',
            'Lost currency due to account issues cannot be recovered',
            'Currency expires if your account is inactive for extended periods'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Premium Services</h3>
        <List
          items={[
            'Premium features may require subscription or one-time payment',
            'Subscription fees are charged in advance',
            'Auto-renewal can be disabled in account settings',
            'No refunds for partially used subscription periods',
            'Prices are subject to change with notice'
          ]}
        />
      </Section>

      <Section id="termination" title="Termination" icon={<XCircle size={20} />}>
        <p>
          We reserve the right to terminate accounts and suspend access for violations of these terms:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Suspension Reasons</h3>
        <List
          items={[
            'Violation of these Terms of Service',
            'Exploiting platform vulnerabilities',
            'Harassment or abusive behavior towards other users',
            'Repeated violations after warnings',
            'Any activity that harms the platform community',
            'Illegal or unauthorized activities'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Consequences</h3>
        <List
          items={[
            'Temporary suspension with warning',
            'Permanent account termination',
            'Loss of all virtual currency and progress',
            'No refunds for terminated accounts',
            'Legal action for serious violations'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>User Termination</h3>
        <p>
          You can terminate your account at any time through your account settings. Upon termination:
        </p>
        <List
          items={[
            'You lose access to your account and all associated data',
            'Virtual currency and purchases are non-refundable',
            'Your content may be retained for legal or operational purposes',
            'You may create a new account after termination, subject to our approval'
          ]}
        />
      </Section>

      <Section id="liability" title="Limitation of Liability" icon={<AlertTriangle size={20} />}>
        <p>
          Our liability is limited as described in this section:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Service Availability</h3>
        <List
          items={[
            'We cannot guarantee 100% uptime or uninterrupted service',
            'The platform may be temporarily unavailable for maintenance or updates',
            'We are not liable for service interruptions or downtime',
            'We strive to maintain high availability but make no guarantees'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Content and Interactions</h3>
        <List
          items={[
            'We are not responsible for user-generated content',
            'We do not endorse or verify user content',
            'User interactions are at your own risk',
            'We are not liable for damages from user interactions',
            'We moderate content but cannot review everything immediately'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Financial Losses</h3>
        <Callout type="warning" title="Virtual Currency Risk">
          All virtual currency purchases are final. We are not liable for losses due to account issues, unauthorized access, or user error.
        </Callout>

        <List
          items={[
            'We are not liable for lost virtual currency',
            'We are not liable for unauthorized purchases',
            'We are not liable for market fluctuations in virtual economy',
            'We are not liable for third-party payment processing issues'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Maximum Liability</h3>
        <p>
          To the fullest extent permitted by law, our total liability for any claims related to the service 
          shall not exceed the amount you paid for the service in the 12 months preceding the claim.
        </p>
      </Section>

      <Section id="updates" title="Updates to Terms" icon={<Zap size={20} />}>
        <p>
          We may update these Terms of Service from time to time:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Notification Process</h3>
        <List
          items={[
            'We will post updated terms on this page',
            'We will update the "Last updated" date',
            'We may notify users of significant changes via email',
            'We may provide in-app notifications for major updates',
            'Continued use of the service constitutes acceptance of updated terms'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>When Changes Occur</h3>
        <List
          items={[
            'Minor updates may occur without notice',
            'Major changes will be announced at least 30 days in advance',
            'Changes required by law may take effect immediately',
            'Users will be informed of material changes that affect their rights',
            'We will provide summaries of significant changes'
          ]}
        />

        <Callout type="info" title="Stay Informed">
          We encourage you to review these terms periodically to stay informed about your rights and responsibilities when using Zankoku.
        </Callout>
      </Section>

      <Section id="contact" title="Contact Information" icon={<FileText size={20} />}>
        <p>
          If you have questions about these Terms of Service, please contact us:
        </p>

        <ContactInfo
          email="legal@zankoku.com"
          phone="1-800-ZANKOKU"
          address="123 Anime Street, Tokyo, Japan 100-0001"
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Report Violations</h3>
        <p>
          To report violations of these terms, please contact us at:
        </p>
        <List
          items={[
            'Email: reports@zankoku.com',
            'Include detailed information about the violation',
            'Provide screenshots or evidence when available',
            'We will investigate all reports promptly',
            'Confidentiality will be maintained when appropriate'
          ]}
        />

        <Callout type="success" title="Community Partnership">
          We rely on our community to help maintain a safe and respectful environment. Thank you for your cooperation in making Zankoku a great platform for everyone.
        </Callout>
      </Section>
    </LegalLayout>
  );
};

export default TermsOfService;
