import SideQuests from '../SideQuests'
import PageTitle from '../ui/PageTitle'
import Section from '../ui/Section'

export default function SideQuestsIndex() {
    return (
        <Section id="side-quests">
            <PageTitle
                title="What's a Side Quest?"
                subtitle="In real life, “SIDE QUEST” refers to any activity or experience that is not part of your main responsibilities or goals; for example, a hobby or skill, etc. While it is not mandatory, but it adds new color and experience to life."
            />
            <SideQuests />
        </Section>
    )
}