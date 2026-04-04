import { Users, Shield, Heart, AlertTriangle, CheckCircle, XCircle, Zap, Award, Flag, BookOpen, Brain } from 'lucide-react';
import LegalLayout from '../components/legal/LegalLayout';
import { Section, Callout, List, FeatureCard, ContactInfo } from '../components/legal/LegalSections';

const CommunityGuidelines = () => {
  const sections = [
    { id: 'core-values', title: 'Core Values', icon: <Heart size={16} /> },
    { id: 'allowed-behaviors', title: 'Allowed Behaviors', icon: <CheckCircle size={16} /> },
    { id: 'prohibited-behaviors', title: 'Prohibited Behaviors', icon: <XCircle size={16} /> },
    { id: 'ai-ethics', title: 'AI Ethics Guidelines', icon: <Brain size={16} /> },
    { id: 'verification', title: 'Verification System Rules', icon: <Shield size={16} /> },
    { id: 'reporting', title: 'Reporting System', icon: <Flag size={16} /> },
    { id: 'enforcement', title: 'Enforcement Actions', icon: <AlertTriangle size={16} /> },
  ];

  const coreValues = [
    {
      icon: <Users size={20} />,
      title: 'Respect',
      description: 'Treat all community members with dignity and respect, regardless of their background, experience level, or opinions.'
    },
    {
      icon: <BookOpen size={20} />,
      title: 'Collaboration',
      description: 'Work together to create a positive learning environment where everyone can grow and improve.'
    },
    {
      icon: <Zap size={20} />,
      title: 'Growth',
      description: 'Encourage continuous learning and skill development through constructive feedback and support.'
    },
    {
      icon: <Heart size={20} />,
      title: 'Community',
      description: 'Build lasting relationships and contribute to a welcoming, inclusive environment for all users.'
    }
  ];

  const allowedBehaviors = [
    'Sharing knowledge and helping others learn',
    'Providing constructive feedback and encouragement',
    'Participating in respectful discussions and debates',
    'Creating and sharing original content',
    'Reporting inappropriate behavior to moderators',
    'Using AI tools responsibly for learning assistance',
    'Celebrating others\' achievements and milestones',
    'Contributing to community events and activities',
    'Mentoring new community members',
    'Following platform rules and guidelines'
  ];

  const prohibitedBehaviors = [
    'Harassment, bullying, or threatening behavior',
    'Hate speech, discrimination, or prejudice',
    'Sharing explicit, violent, or inappropriate content',
    'Plagiarism or academic dishonesty',
    'Using AI tools to cheat or gain unfair advantages',
    'Spamming or disruptive behavior',
    'Impersonating others or creating fake accounts',
    'Sharing personal information without consent',
    'Exploiting bugs or vulnerabilities',
    'Engaging in illegal activities or discussions'
  ];

  const enforcementLevels = [
    {
      level: 'Warning',
      description: 'First-time minor violations receive a written warning and educational resources.',
      icon: <AlertTriangle size={16} />
    },
    {
      level: 'Temporary Suspension',
      description: 'Repeated or more serious violations result in temporary account suspension (1-30 days).',
      icon: <Shield size={16} />
    },
    {
      level: 'Permanent Ban',
      description: 'Severe violations or repeated offenses after warnings lead to permanent account termination.',
      icon: <XCircle size={16} />
    }
  ];

  return (
    <LegalLayout
      title="Community Guidelines"
      description="Rules and expectations for a positive community experience"
      sections={sections}
    >
      <Section id="core-values" title="Core Values" icon={<Heart size={20} />}>
        <p>
          Our community is built on four core values that guide all interactions on Zankoku. 
          These values create the foundation for a safe, inclusive, and productive learning environment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {coreValues.map((value, index) => (
            <FeatureCard
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>

        <Callout type="info" title="Our Commitment">
          These values aren't just words - they're the principles we use to make decisions about our community, content moderation, and platform development.
        </Callout>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Why These Values Matter</h3>
        <List
          items={[
            'They create a safe space for learning and growth',
            'They encourage diverse perspectives and backgrounds',
            'They foster meaningful connections and relationships',
            'They promote academic integrity and ethical behavior',
            'They ensure everyone has an equal opportunity to succeed'
          ]}
        />
      </Section>

      <Section id="allowed-behaviors" title="Allowed Behaviors" icon={<CheckCircle size={20} />}>
        <p>
          We encourage and celebrate these positive behaviors that contribute to our community's success:
        </p>

        <List items={allowedBehaviors} />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Academic Collaboration</h3>
        <List
          items={[
            'Study groups and collaborative learning sessions',
            'Peer review and constructive feedback',
            'Knowledge sharing and resource recommendations',
            'Mentoring relationships between experienced and new users',
            'Educational discussions and debates'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Community Engagement</h3>
        <List
          items={[
            'Participating in community events and challenges',
            'Creating helpful tutorials and guides',
            'Sharing success stories and learning experiences',
            'Organizing study sessions and practice matches',
            'Contributing to community projects and initiatives'
          ]}
        />

        <Callout type="success" title="Recognition and Rewards">
          Users who consistently demonstrate positive behaviors may receive recognition, special badges, and other rewards from our moderation team.
        </Callout>
      </Section>

      <Section id="prohibited-behaviors" title="Prohibited Behaviors" icon={<XCircle size={20} />}>
        <p>
          The following behaviors are strictly prohibited on Zankoku and may result in immediate action:
        </p>

        <List items={prohibitedBehaviors} />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Zero Tolerance Policy</h3>
        <Callout type="error" title="Immediate Action Required">
          The following behaviors result in immediate suspension or permanent ban without warning:
        </Callout>

        <List
          items={[
            'Threats of violence or harm to others',
            'Sharing explicit or illegal content',
            'Harassment based on protected characteristics',
            'Attempts to compromise platform security',
            'Serious academic dishonesty or cheating'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Content Standards</h3>
        <List
          items={[
            'All content must be appropriate for educational settings',
            'No copyrighted material without proper attribution',
            'No misleading or false information presented as fact',
            'No personal attacks or harassment disguised as criticism',
            'No content that violates applicable laws or regulations'
          ]}
        />
      </Section>

      <Section id="ai-ethics" title="AI Ethics Guidelines" icon={<Brain size={20} />}>
        <p>
          AI tools are powerful learning assistants when used responsibly. These guidelines ensure AI enhances rather than undermines the learning experience:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Acceptable AI Use</h3>
        <List
          items={[
            'Using AI for brainstorming and idea generation',
            'Getting explanations of complex concepts',
            'Receiving feedback on writing and communication',
            'Practicing problems and receiving hints',
            'Learning study techniques and strategies'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Prohibited AI Use</h3>
        <Callout type="warning" title="Academic Integrity">
          Using AI to complete assignments, cheat on assessments, or represent AI-generated work as your own violates our academic integrity policy.
        </Callout>

        <List
          items={[
            'Submitting AI-generated content as original work',
            'Using AI during timed assessments or exams',
            'Having AI complete assignments automatically',
            'Using AI to plagiarize or avoid learning',
            'Bypassing learning objectives with AI shortcuts'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>AI Attribution</h3>
        <List
          items={[
            'Always disclose when you used AI assistance',
            'Cite AI tools appropriately in academic work',
            'Be transparent about AI-generated content',
            'Follow your institution\'s AI usage policies',
            'Use AI to enhance, not replace, your learning'
          ]}
        />
      </Section>

      <Section id="verification" title="Verification System Rules" icon={<Shield size={20} />}>
        <p>
          Our verification system helps ensure community safety and authenticity. These rules govern verification processes and usage:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Verification Requirements</h3>
        <List
          items={[
            'Provide accurate and truthful information during verification',
            'Use legitimate identification documents',
            'Do not share verification credentials with others',
            'Maintain updated information in your profile',
            'Report any verification issues immediately'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Prohibited Verification Activities</h3>
        <List
          items={[
            'Using fake or fraudulent documents',
            'Paying others to verify your account',
            'Creating multiple verified accounts',
            'Sharing or selling verification status',
            'Exploiting verification system vulnerabilities'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Verification Benefits and Responsibilities</h3>
        <Callout type="info" title="Verified Status">
          Verification provides additional trust and access to certain features, but also comes with increased responsibility to maintain community standards.
        </Callout>

        <List
          items={[
            'Verified users have access to advanced features',
            'Verification status can be revoked for violations',
            'Verified users are expected to model positive behavior',
            'Additional scrutiny may apply to verified accounts',
            'Verification does not exempt users from community guidelines'
          ]}
        />
      </Section>

      <Section id="reporting" title="Reporting System" icon={<Flag size={20} />}>
        <p>
          Our reporting system empowers community members to help maintain a safe environment. 
          Here's how reporting works and what to expect:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>What to Report</h3>
        <List
          items={[
            'Violations of community guidelines',
            'Inappropriate or harmful content',
            'Harassment or bullying behavior',
            'Academic dishonesty or cheating',
            'Security vulnerabilities or exploits',
            'Impersonation or fake accounts'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>How to Report</h3>
        <List
          items={[
            'Use the report button on content or profiles',
            'Include detailed information about the violation',
            'Provide screenshots or evidence when available',
            'Be specific about which guidelines were violated',
            'Submit reports in good faith and with accurate information'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Report Review Process</h3>
        <Callout type="info" title="Timeline">
          Most reports are reviewed within 24-48 hours. Urgent safety concerns are prioritized and addressed immediately.
        </Callout>

        <List
          items={[
            'Reports are reviewed by trained moderation staff',
            'We investigate all reports thoroughly and fairly',
            'Both the reporter and reported user may be contacted',
            'Confidentiality is maintained when possible',
            'Users are notified of report outcomes when appropriate'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>False Reporting</h3>
        <List
          items={[
            'Intentionally false reports are prohibited',
            'Abuse of the reporting system may result in penalties',
            'Report in good faith with accurate information',
            'If unsure, report and let moderators decide',
            'Multiple false reports may result in account suspension'
          ]}
        />
      </Section>

      <Section id="enforcement" title="Enforcement Actions" icon={<AlertTriangle size={20} />}>
        <p>
          We take community guidelines seriously and enforce them consistently. 
          Our enforcement approach focuses on education and progressive discipline:
        </p>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Enforcement Philosophy</h3>
        <List
          items={[
            'Education first: Help users understand and correct mistakes',
            'Consistent application: Rules apply equally to all users',
            'Proportional response: Penalties match violation severity',
            'Opportunity for improvement: Users can learn from mistakes',
            'Community safety: Protect the community from harm'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Enforcement Levels</h3>
        <div className="space-y-4 my-6">
          {enforcementLevels.map((level, index) => (
            <div key={index} className="p-4 rounded-lg border" style={{ background: '#ffffff', borderColor: '#e5e5e5' }}>
              <div className="flex items-center gap-3 mb-2">
                <div style={{ color: '#3b82f6' }}>{level.icon}</div>
                <h4 className="font-semibold" style={{ color: '#1a1a1a' }}>
                  {level.level}
                </h4>
              </div>
              <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{level.description}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Appeals Process</h3>
        <List
          items={[
            'Users can appeal enforcement decisions within 7 days',
            'Appeals are reviewed by different moderation staff',
            'Additional evidence or context may be requested',
            'Appeal decisions are final and binding',
            'Repeated appeals without merit may be restricted'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Reinstatement</h3>
        <Callout type="success" title="Second Chances">
          We believe in rehabilitation and may allow suspended users to return after demonstrating understanding of community guidelines and commitment to positive behavior.
        </Callout>

        <List
          items={[
            'Suspended users may request reinstatement after serving their time',
            'Reinstatement requires acknowledging guideline violations',
            'Users may need to complete educational modules about community standards',
            'Probationary status may apply to reinstated accounts',
            'Further violations after reinstatement result in permanent bans'
          ]}
        />

        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Contact for Enforcement Issues</h3>
        <p>
          If you have questions about enforcement actions or need to report urgent issues:
        </p>
        <List
          items={[
            'Email: moderation@zankoku.com',
            'Urgent safety concerns: emergencies@zankoku.com',
            'Appeal requests: appeals@zankoku.com',
            'General questions: community@zankoku.com'
          ]}
        />

        <Callout type="info" title="Community Partnership">
          Our enforcement system works best when everyone participates. Thank you for helping us maintain a safe, productive, and welcoming community for all Zankoku users.
        </Callout>
      </Section>
    </LegalLayout>
  );
};

export default CommunityGuidelines;
