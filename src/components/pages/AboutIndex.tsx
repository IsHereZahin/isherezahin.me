import AboutContent from "../about/AboutContent";
import CurrentStatusCard from "../about/CurrentStatusCard";
import Education from "../about/Education";
import WorkExperience from "../about/WorkExperience";

export default function AboutIndex() {
    return (
        <>
            <AboutContent />
            <CurrentStatusCard />
            <WorkExperience />
            <Education />
        </>
    );
}