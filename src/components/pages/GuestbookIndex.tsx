import Comment from '@/components/content/Giscus/Comment'
import PageTitle from '@/components/ui/PageTitle'
import ReferralLink from '@/components/ui/ReferralLink'
import Section from '@/components/ui/Section'
import { AMA_DISCUSSION_URL } from '@/lib/constants'
import MotionWrapper from '../motion/MotionWrapper'

export default function GuestbookIndex() {
    return (
        <Section id="guestbook">
            <PageTitle
                title="GuestBook"
                subtitle="Leave whatever you want to say, message, appreciation, suggestions or feedback."
            />
            <div className="mt-8">
                <MotionWrapper direction="left" delay={0.2}>
                    <div className="text-secondary-foreground text-sm">For any questions, feel free to leave them in the <ReferralLink href={AMA_DISCUSSION_URL} className="underline">AMA discussion</ReferralLink> or contact me via email.</div>
                </MotionWrapper>
                <Comment />
            </div>
        </Section>
    )
}
