import CurrentStatus from "./sections/CurrentStatus";
import Education from "./sections/Education";
import Profile from "./sections/Profile";
import WorkExperience from "./sections/WorkExperience";

/**
 * About page composition. Every section renders from
 * `src/data/pages/about.ts` — nothing here touches the database.
 */
export default function AboutIndex() {
    return (
        <>
            <Profile />
            <CurrentStatus />
            <WorkExperience />
            <Education />
        </>
    );
}
