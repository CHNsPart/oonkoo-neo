import AboutPageContent from '@/components/pages/about-us/about-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About OonkoO | Leading Digital Innovation Agency",
  description: "Learn about OonkoO's journey, our passionate team, and our commitment to delivering exceptional digital solutions. Discover how we help businesses thrive in the digital age.",
  keywords: "about OonkoO, digital agency team, IT company history, technology innovation, company values, digital expertise",
};

export default function AboutPage() {
  return <AboutPageContent />;
}