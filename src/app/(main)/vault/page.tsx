import VaultApp from "@/components/pages/vault/VaultApp";
import { Section } from "@/components/ui";

export const metadata = {
    title: "Personal Vault",
    robots: { index: false, follow: false },
};

export default function VaultPage() {
    return (
        <Section id="vault">
            <div className="mt-6">
                <VaultApp />
            </div>
        </Section>
    );
}
