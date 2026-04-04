import { Cookie, Shield, Eye, Settings, AlertCircle, CheckCircle, Info, Lock, Database, Users } from 'lucide-react';
import LegalLayout from '../components/legal/LegalLayout';
import { Section, Callout, List, FeatureCard, CookieCategories } from '../components/legal/LegalSections';

const CookiePolicy = () => {
  const sections = [
    { id: 'introduction', title: 'What Are Cookies?', icon: <Cookie size={16} /> },
    { id: 'types', title: 'Types of Cookies We Use', icon: <Database size={16} /> },
    { id: 'third-party', title: 'Third-Party Cookies', icon: <Users size={16} /> },
    { id: 'control', title: 'How to Control Cookies', icon: <Settings size={16} /> },
    { id: 'updates', title: 'Updates to This Policy', icon: <Eye size={16} /> },
  ];

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      purpose: 'These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.',
      essential: true
    },
    {
      name: 'Analytics Cookies',
      purpose: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
      essential: false
    },
    {
      name: 'Personalization Cookies',
      purpose: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
      essential: false
    },
    {
      name: 'Advertising Cookies',
      purpose: 'These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.',
      essential: false
    },
    {
      name: 'Social Media Cookies',
      purpose: 'These cookies are set by a range of social media services that we have added to our site to enable you to share our content with your friends and networks.',
      essential: false
    }
  ];

  const cookieFeatures = [
    {
      icon: <Shield size={20} />,
      title: 'Security',
      description: 'Essential cookies help protect your account and prevent unauthorized access'
    },
    {
      icon: <Eye size={20} />,
      title: 'Analytics',
      description: 'We use cookies to understand how users interact with our platform'
    },
    {
      icon: <Settings size={20} />,
      title: 'Customization',
      description: 'Cookies remember your preferences and settings for a better experience'
    },
    {
      icon: <Lock size={20} />,
      title: 'Privacy',
      description: 'You have control over which cookies you accept on our platform'
    }
  ];

  return (
    <LegalLayout
      title="Cookie Policy"
      description="How we use cookies and similar technologies"
      sections={sections}
    >
      <Section id="introduction" title="What Are Cookies?" icon={<Cookie size={20} />}>
        <p>
          Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. 
          They are widely used to make websites work more efficiently and to provide information to website owners.
        </p>

        <Callout type="success" title="Zankoku Does Not Use Cookies">
          <strong>Important:</strong> Zankoku does not use cookies or similar tracking technologies on our platform. We have designed our system to work without any cookie tracking.
        </Callout>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>How We Work Without Cookies</h3>
        <List
          items={[
            'Your account information is stored securely on our servers',
            'Session management is handled through secure authentication tokens',
            'Preferences are saved to your account profile, not your device',
            'We use server-side tracking for analytics instead of cookies',
            'Your privacy is protected by not storing tracking data on your device'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Benefits of No-Cookie Approach</h3>
        <List
          items={[
            'Enhanced privacy protection for all users',
            'No tracking across different websites',
            'Cleaner, faster browsing experience',
            'No need to manage cookie preferences',
            'Compliance with strict privacy regulations'
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {cookieFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Section>

      <Section id="types" title="Types of Cookies We Use" icon={<Database size={20} />}>
        <p>
          Since Zankoku does not use cookies, we don't have any of the traditional cookie categories. 
          Here's how we provide similar functionality without using cookies:
        </p>

        <Callout type="success" title="No Cookie Policy">
          <strong>Zankoku operates completely without cookies.</strong> All functionality that would typically require cookies is handled through alternative, privacy-respecting methods.
        </Callout>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>What We Don't Use</h3>
        <List
          items={[
            'No essential cookies - Session management handled server-side',
            'No analytics cookies - Usage tracked through server logs only',
            'No personalization cookies - Preferences stored in your account',
            'No advertising cookies - We don\'t track you for advertising',
            'No social media cookies - No third-party tracking scripts'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>How We Replace Cookie Functionality</h3>
        <List
          items={[
            'Authentication: Secure session tokens instead of persistent cookies',
            'Preferences: Account-based settings stored on our servers',
            'Analytics: Anonymous server-side usage tracking',
            'Personalization: Profile-based recommendations',
            'Security: Advanced server-side protection without device tracking'
          ]}
        />

        <Callout type="info" title="Privacy First">
          Our no-cookie approach ensures that your browsing activity cannot be tracked across different websites, providing maximum privacy protection.
        </Callout>
      </Section>

      <Section id="third-party" title="Third-Party Cookies" icon={<Users size={20} />}>
        <p>
          Since Zankoku does not use cookies, we also do not allow third-party cookies on our platform. 
          This means no external services can place tracking cookies on your device through our website.
        </p>

        <Callout type="success" title="No Third-Party Tracking">
          <strong>Zero third-party cookies:</strong> We prevent all external services from placing cookies on your device when you use Zankoku.
        </Callout>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Services We Use Without Cookies</h3>
        <List
          items={[
            'Payment processors: Transaction-only, no persistent tracking',
            'Cloud hosting: Infrastructure-only, no user tracking',
            'Email services: Transactional emails only',
            'Security monitoring: Server-side protection only',
            'Analytics: Anonymous server-side metrics only'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>How We Maintain Functionality</h3>
        <List
          items={[
            'Payments: Direct API calls without tracking cookies',
            'Analytics: Server-side log analysis instead of user tracking',
            'Security: Server-based threat detection',
            'Communication: Direct email delivery without tracking pixels',
            'Performance: Server-side monitoring without device fingerprinting'
          ]}
        />

        <Callout type="info" title="Maximum Privacy">
          Our no-third-party-cookie policy ensures that your activity on Zankoku cannot be tracked by advertisers, data brokers, or other third-party services.
        </Callout>
      </Section>

      <Section id="control" title="How to Control Cookies" icon={<Settings size={20} />}>
        <p>
          Since Zankoku does not use cookies, there's no need to manage cookie settings on our platform. 
          Your privacy is automatically protected without any configuration required.
        </p>

        <Callout type="success" title="No Action Required">
          <strong>Zero cookie management needed:</strong> Zankoku works perfectly without any cookies, so you don't need to change any settings or preferences.
        </Callout>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>What You Don't Need to Do</h3>
        <List
          items={[
            'No need to accept or decline cookies',
            'No need to configure cookie preferences',
            'No need to clear cookies from our site',
            'No need to manage third-party cookie settings',
            'No need to worry about tracking across websites'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Your Privacy is Automatic</h3>
        <List
          items={[
            'No tracking cookies are ever placed on your device',
            'No third-party services can track you through our platform',
            'No advertising profiles are built from your activity',
            'No cross-site tracking is possible',
            'No device fingerprinting or behavioral tracking'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Browser Settings (Optional)</h3>
        <p>
          While you don't need to change anything for Zankoku, you may still want to configure your browser for other websites:
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2" style={{ color: '#1a1a1a' }}>Chrome</h4>
            <p style={{ color: '#4b5563' }}>
              Settings → Privacy and security → Cookies and other site data
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2" style={{ color: '#1a1a1a' }}>Firefox</h4>
            <p style={{ color: '#4b5563' }}>
              Options → Privacy & Security → Cookies and Site Data
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2" style={{ color: '#1a1a1a' }}>Safari</h4>
            <p style={{ color: '#4b5563' }}>
              Preferences → Privacy → Cookies and website data
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2" style={{ color: '#1a1a1a' }}>Edge</h4>
            <p style={{ color: '#4b5563' }}>
              Settings → Privacy, search, and services → Cookies and site data
            </p>
          </div>
        </div>

        <Callout type="info" title="Privacy by Design">
          Zankoku is built with privacy as a fundamental principle. Our no-cookie approach means you get maximum protection automatically, without any effort on your part.
        </Callout>
      </Section>

      <Section id="updates" title="Updates to This Policy" icon={<Eye size={20} />}>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our use of cookies 
          or changes in applicable law.
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>When We Update</h3>
        <List
          items={[
            'We will post the updated policy on this page',
            'We will update the "Last updated" date',
            'We may notify users of significant changes via email',
            'We will show the consent banner again for major changes',
            'Continued use of our service constitutes acceptance of updated terms'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Types of Updates</h3>
        <List
          items={[
            'Adding new cookie types for improved functionality',
            'Updating third-party service providers',
            'Changing how we use existing cookies',
            'Complying with new privacy regulations',
            'Improving transparency about our practices'
          ]}
        />

        <Callout type="info" title="Stay Informed">
          We encourage you to review this policy periodically to stay informed about our cookie practices and how they may affect your privacy.
        </Callout>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Questions and Concerns</h3>
        <p>
          If you have questions about this Cookie Policy or how we use cookies on our platform, please contact us:
        </p>
        <List
          items={[
            'Email: privacy@zankoku.com',
            'Subject line: "Cookie Policy Question"',
            'We typically respond within 48 hours',
            'For technical issues, include browser and device information'
          ]}
        />

        <Callout type="success" title="Your Privacy Matters">
          We are committed to being transparent about our cookie practices and giving you control over your data. Thank you for trusting Zankoku with your privacy.
        </Callout>
      </Section>
    </LegalLayout>
  );
};

export default CookiePolicy;
