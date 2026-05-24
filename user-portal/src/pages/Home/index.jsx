import PageSEO from '../../components/ui/PageSEO';
import HeroSection from './HeroSection';
import ProcessFlow from './ProcessFlow';
import ServicesPreview from './ServicesPreview';
import SpecialtyDivisions from './SpecialtyDivisions';
import StatsSection from './StatsSection';
import Testimonials from './Testimonials';
import CtaBanner from './CtaBanner';

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SkillCite",
    "url": "https://skillcite.com",
    "description": "Engineering recruitment and consultancy services",
    "serviceType": ["Engineering Recruitment", "Technical Staffing", "Engineering Consultancy"]
  };

  return (
    <>
      <PageSEO
        title="Engineering Recruitment & Services | SkillCite"
        description="SkillCite connects engineering talent with leading companies. Submit your CV or request engineers — our specialist team handles everything personally."
        canonical="/"
        schema={schema}
      />
      <div className="w-full flex flex-col">
        <HeroSection />
        <ProcessFlow />
        <ServicesPreview />
        <SpecialtyDivisions />
        <StatsSection />
        <Testimonials />
        <CtaBanner />
      </div>
    </>
  );
}
