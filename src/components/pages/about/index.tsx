import type { AboutContent } from "@/data/pages/about";
import CurrentStatus from "./sections/CurrentStatus";
import Education from "./sections/Education";
import Profile from "./sections/Profile";
import WorkExperience from "./sections/WorkExperience";

/** About page composition. Copy comes from the active locale's dictionary. */
export default function AboutIndex({ content }: { readonly content: AboutContent }) {
    return (
        <>
            <Profile heading={content.heading} profile={content.profile} />
            <CurrentStatus {...content.currentStatus} />
            <WorkExperience {...content.workExperience} />
            <Education {...content.education} />
        </>
    );
}
