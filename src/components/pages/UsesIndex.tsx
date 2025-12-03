import {
    Battery,
    Chrome,
    Code2,
    Command,
    Cpu,
    CreditCard,
    Database,
    Figma,
    HardDrive,
    Headphones,
    ImageIcon,
    Keyboard,
    Laptop,
    Monitor,
    Mouse,
    Music,
    Shield,
    Terminal,
    Wifi
} from "lucide-react";
import DeskImage from "../../../public/assets/images/uses/desk.jpg";
import MonitorImage from "../../../public/assets/images/uses/monitor-screen-abstract.jpg";

import { Badge } from "@/components/ui/badge";
import BlurImage from "@/components/ui/BlurImage";
import ImageZoom from "@/components/ui/ImageZoom";
import PageTitle from "@/components/ui/PageTitle";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

export default function UsesIndex() {
    return (
        <Section id="uses" animate delay={0.1}>
            {/* Header Section - Reduced margin on small screens */}
            <section className="mb-12 sm:mb-20"> {/* Changed from mb-20 */}
                <PageTitle title="My Daily Uses" subtitle="A peek into my workspace and the tools that power my creative workflow." />
                {/* Hero Image / Setup Shot */}
                <ImageZoom>
                    <div className="group relative aspect-video w-full rounded-2xl md:rounded-3xl bg-secondary cursor-zoom-in">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
                        {/* Image */}
                        <BlurImage
                            src={DeskImage}
                            alt="Workspace Setup"
                            className="rounded-2xl"
                        />
                        {/* Badges - Adjusted positioning for small screens */}
                        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 flex flex-wrap gap-1 sm:gap-2"> {/* Changed from bottom-6 left-6, gap-2 */}
                            <Badge
                                variant="secondary"
                                className="bg-popover/80 text-xs backdrop-blur-md border-border text-foreground hover:bg-popover/60"
                            >
                                Updated Nov 2025
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="bg-popover/80 text-xs backdrop-blur-md border-border text-foreground hover:bg-popover/60"
                            >
                                Home Office
                            </Badge>
                        </div>

                        {/* Decorative gradient blur - Scaled down on small screens */}
                        <div className="absolute -bottom-8 sm:-bottom-12 -right-8 sm:-right-12 h-32 sm:h-64 w-32 sm:w-64 bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" /> {/* Changed from h-64 w-64, -bottom-12 -right-12 */}
                    </div>
                </ImageZoom>
            </section>

            {/* Workstation - Bento Grid Layout - Adjusted gaps */}
            <section id="workstation" className="mb-16 sm:mb-24 scroll-mt-24"> {/* Changed from mb-24 */}
                <SectionHeader tag="01" title="Hardware" subtitle="The computing power behind the pixels." />
                <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-4 md:grid-rows-2"> {/* Changed from gap-4 */}
                    {/* Main Computer - Large Card - Responsive padding and text */}
                    <div className="group relative col-span-1 md:col-span-2 md:row-span-2 overflow-hidden rounded-2xl md:rounded-3xl shadow-feature-card p-4 sm:p-8 transition-all duration-300"> {/* Changed from p-8 */}
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="space-y-2 sm:space-y-3"> {/* Changed from space-y-3 */}
                                <div className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full bg-foreground/5 shadow-feature-card group-hover:bg-foreground/10 transition-colors"> {/* Changed from h-10 w-10 */}
                                    <Laptop className="h-4 sm:h-5 w-4 sm:w-5 text-foreground" /> {/* Changed from h-5 w-5 */}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground"> {/* Changed from text-xl */}
                                    MacBook Pro 16"
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground"> {/* Changed from text-base */}
                                    M3 Max, 64GB RAM, 2TB SSD
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-8 space-y-2 sm:space-y-4"> {/* Changed from mt-8 space-y-4 */}
                                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80"> {/* Changed from text-base */}
                                    The absolute heart of my workflow. The M3 Max chip handles Docker containers, Figma renders, and
                                    video editing without spinning up the fans. Space Black finish, naturally.
                                </p>
                                <div className="flex flex-wrap gap-1 sm:gap-2"> {/* Changed from gap-2 */}
                                    <SpecBadge icon={Cpu} label="16-Core CPU" />
                                    <SpecBadge icon={Battery} label="22hr Battery" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-8 sm:-bottom-12 -right-8 sm:-right-12 h-32 sm:h-64 w-32 sm:w-64 bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" /> {/* Scaled like hero */}
                    </div>

                    {/* Monitor - Responsive flex and text */}
                    <div className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl md:rounded-3xl shadow-feature-card p-4 sm:p-8 transition-all duration-300"> {/* Changed from p-8 */}
                        <div className="flex h-full flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6"> {/* Changed from gap-6 */}
                            <div className="space-y-1 sm:space-y-2"> {/* Changed from space-y-2 */}
                                <div className="flex items-center gap-2 sm:gap-3"> {/* Changed from gap-3 */}
                                    <Monitor className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" /> {/* Changed from h-5 w-5 */}
                                    <h3 className="text-base sm:text-lg font-semibold text-foreground"> {/* Changed from text-lg */}
                                        LG UltraFine 5K
                                    </h3>
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground"> {/* Changed from text-base */}
                                    27-inch IPS, 5120 x 2880
                                </p>
                                <p className="text-xs text-muted-foreground max-w-xs group-hover:text-foreground/80"> {/* Unchanged, already xs */}
                                    Pixel-perfect density for interface design. The matte finish helps with glare during the day.
                                </p>
                            </div>
                            <ImageZoom>
                                <div className="relative h-20 sm:h-24 w-full md:w-32 shrink-0 overflow-hidden rounded-lg bg-secondary shadow-feature-card group-hover:border-secondary/30 transition-colors"> {/* Changed from h-24 */}
                                    <BlurImage
                                        src={MonitorImage}
                                        alt="Monitor"
                                        className="object-cover opacity-60"
                                    />
                                </div>
                            </ImageZoom>
                        </div>
                    </div>

                    {/* Secondary Device 1 - Responsive padding */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl shadow-feature-card p-3 sm:p-6 transition-all duration-300"> {/* Changed from p-6 */}
                        <div className="space-y-2 sm:space-y-4"> {/* Changed from space-y-4 */}
                            <HardDrive className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground group-hover:text-foreground transition-colors" /> {/* Changed from h-5 w-5 */}
                            <div>
                                <h3 className="text-sm sm:text-base font-semibold text-foreground"> {/* Changed from text-base */}
                                    Samsung T7
                                </h3>
                                <p className="text-xs text-muted-foreground group-hover:text-foreground/80"> {/* Unchanged */}
                                    2TB Shield Edition
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Device 2 - Responsive padding */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl shadow-feature-card p-3 sm:p-6 transition-all duration-300"> {/* Changed from p-6 */}
                        <div className="space-y-2 sm:space-y-4"> {/* Changed from space-y-4 */}
                            <Wifi className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground group-hover:text-foreground transition-colors" /> {/* Changed from h-5 w-5 */}
                            <div>
                                <h3 className="text-sm sm:text-base font-semibold text-foreground"> {/* Changed from text-base */}
                                    Unifi Dream
                                </h3>
                                <p className="text-xs text-muted-foreground group-hover:text-foreground/80"> {/* Unchanged */}
                                    Router SE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Peripherals Section - Adjusted gaps and padding */}
            <section id="peripherals" className="mb-16 sm:mb-24 scroll-mt-24"> {/* Changed from mb-24 */}
                <SectionHeader tag="02" title="Peripherals" subtitle="Input devices that make work feel like play." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"> {/* Changed from gap-6 */}
                    <PeripheralCard
                        icon={Keyboard}
                        title="Keychron Q1 Pro"
                        subtitle="Custom Build"
                        description="Lubed Boba U4T switches for that thocky sound. Aluminum frame adds satisfying weight."
                    />
                    <PeripheralCard
                        icon={Mouse}
                        title="Logitech MX Master 3S"
                        subtitle="Pale Gray"
                        description="The electromagnetic wheel is a game changer for scrolling through long documentation."
                    />
                    <PeripheralCard
                        icon={Headphones}
                        title="Sony WH-1000XM5"
                        subtitle="Noise Cancelling"
                        description="Essential for deep focus blocks. The transparency mode is surprisingly natural."
                    />
                </div>
            </section>

            {/* Software Stack - Clean List - Adjusted spacing */}
            <section id="stack" className="mb-16 sm:mb-24 scroll-mt-24"> {/* Changed from mb-24 */}
                <SectionHeader tag="03" title="Software" subtitle="The virtual environment." />
                <div className="divide-y divide-border border-t border-b border-border">
                    <SoftwareItem
                        icon={Code2}
                        name="VS Code"
                        category="Editor"
                        description="My customized editor with the 'Vesper' theme and 'Dank Mono' font."
                    />
                    <SoftwareItem
                        icon={Terminal}
                        name="Warp"
                        category="Terminal"
                        description="Rust-based terminal that feels like a modern text editor. AI command search is clutch."
                    />
                    <SoftwareItem
                        icon={Figma}
                        name="Figma"
                        category="Design"
                        description="Where all UI concepts start. I use it for wireframing, prototyping, and presentations."
                    />
                    <SoftwareItem
                        icon={Chrome}
                        name="Arc Browser"
                        category="Browser"
                        description="Changed how I browse the web. Spaces and Boosts make it incredibly flexible."
                    />
                    <SoftwareItem
                        icon={Database}
                        name="TablePlus"
                        category="Database"
                        description="The best GUI for managing SQL databases. Clean, native, and fast."
                    />
                    <SoftwareItem
                        icon={Command}
                        name="Raycast"
                        category="Productivity"
                        description="Replaced Spotlight completely. Scripts, window management, and quick calculations."
                    />
                    <SoftwareItem
                        icon={Shield}
                        name="1Password"
                        category="Security"
                        description="I don't know any of my passwords, and that's the way I like it."
                    />
                </div>
            </section>

            {/* Services / Subs - Compact Grid - Adjusted gaps */}
            <section className="mb-8 sm:mb-12"> {/* Changed from mb-12 */}
                <h3 className="mb-4 sm:mb-8 text-xs sm:text-base font-medium uppercase tracking-wider text-muted-foreground"> {/* Changed from text-base mb-8 */}
                    Subscriptions & Services
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"> {/* Changed from gap-4 */}
                    <SubCard name="Youtube Pro" icon={Music} price="Premium" />
                    <SubCard name="Claude Pro" icon={Code2} price="AI Assistant" />
                    <SubCard name="Midjourney" icon={ImageIcon} price="Standard" />
                    <SubCard name="Setapp" icon={CreditCard} price="Bundle" />
                </div>
            </section>
        </Section>
    )
}

function SpecBadge({ icon: Icon, label }: Readonly<{ icon: any; label: string }>) {
    return (
        <div className="flex items-center gap-1 rounded-full bg-secondary/5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-secondary/20 hover:bg-secondary/10 transition-colors"> {/* Adjusted gap-1.5 to gap-1, px-3 py-1.5 to responsive */}
            <Icon className="h-2.5 sm:h-3 w-2.5 sm:w-3" /> {/* Changed from h-3 w-3 */}
            {label}
        </div>
    )
}

function PeripheralCard({
    icon: Icon,
    title,
    subtitle,
    description,
}: Readonly<{ icon: any; title: string; subtitle: string; description: string }>) {
    return (
        <div className="group rounded-2xl shadow-feature-card p-4 sm:p-6 transition-all duration-300"> {/* Changed from p-6 */}
            <div className="mb-3 sm:mb-4 inline-flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-lg shadow-feature-card bg-foreground/5 text-muted-foreground group-hover:text-foreground group-hover:bg-foreground/10 transition-colors"> {/* Changed from h-10 w-10 mb-4 */}
                <Icon className="h-4 sm:h-5 w-4 sm:w-5" /> {/* Changed from h-5 w-5 */}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground"> {/* Changed from text-lg */}
                {title}
            </h3>
            <span className="mb-2 sm:mb-3 block text-xs font-medium text-secondary-foreground/70"> {/* Changed from mb-3 */}
                {subtitle}
            </span>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors"> {/* Changed from text-base */}
                {description}
            </p>
        </div>
    )
}

function SoftwareItem({
    icon: Icon,
    name,
    category,
    description,
}: Readonly<{ icon: any; name: string; category: string; description: string }>) {
    return (
        <div className="group flex flex-col gap-3 sm:gap-4 py-4 sm:py-6 md:flex-row md:items-center md:justify-between transition-all hover:bg-secondary/3 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"> {/* Adjusted gap-4 to gap-3 sm:gap-4, py-6 to py-4 sm:py-6, px-4 -mx-4 to responsive */}
            <div className="flex items-start md:items-center gap-3 sm:gap-4"> {/* Changed from gap-4 */}
                <div className="flex h-10 sm:h-12 w-10 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-secondary dark:bg-accent/70 ring-1 ring-border group-hover:ring-secondary/30 transition-all"> {/* Changed from h-12 w-12 */}
                    <Icon className="h-5 sm:h-6 w-5 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors" /> {/* Changed from h-6 w-6 */}
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{name}</h4> {/* Unchanged, already suitable */}
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{category}</span> {/* Unchanged */}
                </div>
            </div>
            <p className="max-w-md text-sm sm:text-base text-muted-foreground md:text-right group-hover:text-foreground/80 transition-colors"> {/* Changed from text-base */}
                {description}
            </p>
        </div>
    )
}

function SubCard({ name, icon: Icon, price }: Readonly<{ name: string; icon: any; price: string }>) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 rounded-lg shadow-feature-card p-3 sm:p-4 transition-all"> {/* Changed from gap-3 p-4 */}
            <Icon className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" /> {/* Changed from h-4 w-4 */}
            <div>
                <div className="text-sm sm:text-base font-medium text-foreground"> {/* Changed from text-base */}
                    {name}
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider"> {/* Changed from text-[10px] */}
                    {price}
                </div>
            </div>
        </div>
    )
}