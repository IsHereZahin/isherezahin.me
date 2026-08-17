import { NotFoundState } from "@/components/ui";

export default function SayloNotFound() {
    return (
        <NotFoundState
            title="Saylo Not Found"
            message="The saylo you're looking for doesn't exist or has been removed."
            buttonText="Browse Saylos"
            buttonHref="/saylo"
        />
    );
}
