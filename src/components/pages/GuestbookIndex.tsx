// import GitHubComments from '@/components/content/discussions/Comment'
import PageTitle from '@/components/ui/PageTitle'
import ReferralLink from '@/components/ui/ReferralLink'
import Section from '@/components/ui/Section'
import { AMA_DISCUSSION_URL } from '@/lib/constants'
import GitHubComments from '../content/discussions/GithubDiscussions'

export default function GuestbookIndex({ discussionNumber }: { readonly discussionNumber: number }) {
    return (
        <Section id="guestbook" className='px-6 py-16 max-w-3xl'>
            <PageTitle
                title="GuestBook"
                subtitle="Leave whatever you want to say, message, appreciation, suggestions or feedback."
            />
            <div className="mt-6 sm:mt-8">
                <GitHubComments discussionNumber={discussionNumber} />
                <div className="text-muted-foreground text-xs sm:text-sm text-center mt-4 sm:mt-5">For any questions, feel free to leave them in the <ReferralLink href={AMA_DISCUSSION_URL} className="underline hover:text-primary transition-colors">AMA discussion</ReferralLink> or contact me via email.</div>
            </div>
        </Section>
    )
}
