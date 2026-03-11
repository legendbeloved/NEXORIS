import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useTheme } from '../ThemeProvider';

export const OnboardingTour: React.FC = () => {
  const { theme } = useTheme();
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if tour has been completed
    const tourCompleted = localStorage.getItem('nexoris_tour_completed');
    if (!tourCompleted) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem('nexoris_tour_completed', 'true');
    }
  };

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-left">
          <h3 className="font-display font-bold text-lg mb-2 text-brand-primary">Welcome to NEXORIS!</h3>
          <p>Let's take a quick tour of your autonomous client acquisition command center.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: 'Your main dashboard. See live agent status, key metrics, and revenue overview at a glance.',
    },
    {
      target: '[data-tour="agents"]',
      content: 'Manage your AI workforce. Configure, start, or stop your Discovery, Outreach, and Negotiation agents here.',
    },
    {
      target: '[data-tour="prospects"]',
      content: 'View all discovered leads. Track their status from "Found" to "Deal Closed".',
    },
    {
      target: '[data-tour="outreach"]',
      content: 'Monitor email campaigns. See open rates, reply rates, and active A/B tests.',
    },
    {
      target: '[data-tour="notification-bell"]',
      content: 'Stay updated. Real-time alerts for new leads, replies, and payments appear here.',
    },
    {
      target: '[data-tour="settings"]',
      content: 'Configure global settings, integrations (Stripe, Resend), and account preferences.',
    },
  ];

  const styles = {
    options: {
      arrowColor: theme === 'dark' ? '#1e1e2e' : '#ffffff',
      backgroundColor: theme === 'dark' ? '#1e1e2e' : '#ffffff',
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      primaryColor: '#5B4CF5',
      textColor: theme === 'dark' ? '#e4e4e7' : '#18181b',
      zIndex: 1000,
    },
    tooltip: {
      borderRadius: '16px',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: '14px',
      padding: '20px',
    },
    buttonNext: {
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 'bold',
      padding: '10px 20px',
    },
    buttonBack: {
      color: theme === 'dark' ? '#a1a1aa' : '#71717a',
      marginRight: '10px',
    },
    buttonSkip: {
      color: theme === 'dark' ? '#a1a1aa' : '#71717a',
    },
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={styles}
      callback={handleJoyrideCallback}
      locale={{
        last: 'Finish',
        skip: 'Skip Tour',
      }}
    />
  );
};
