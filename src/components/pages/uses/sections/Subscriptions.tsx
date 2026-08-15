import { USES_SUBSCRIPTIONS } from "@/data";
import type { SubscriptionEntry } from "@/data/types";

function SubCard({ icon: Icon, name, plan }: Readonly<SubscriptionEntry>) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 rounded-lg shadow-feature-card p-3 sm:p-4 transition-all">
            <Icon className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
            <div>
                <div className="text-sm sm:text-base font-medium text-foreground">{name}</div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">
                    {plan}
                </div>
            </div>
        </div>
    );
}

export default function Subscriptions() {
    const { title, items } = USES_SUBSCRIPTIONS;

    return (
        <section className="mb-8 sm:mb-12">
            <h3 className="mb-4 sm:mb-8 text-xs sm:text-base font-medium uppercase tracking-wider text-muted-foreground">
                {title}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                {items.map((item) => (
                    <SubCard key={item.name} {...item} />
                ))}
            </div>
        </section>
    );
}
