import WorkExperience from '../about/WorkExperience'
import AboutSection from '../home/AboutSection'
import PageTitle from '../ui/PageTitle'
import Section from '../ui/Section'

export default function AboutIndex() {
    return (
        <Section id="about">
            <PageTitle title="Meet the Developer" subtitle="A story of growth and discovery" />
            <AboutSection />
            <WorkExperience />
        </Section>
    )
}
