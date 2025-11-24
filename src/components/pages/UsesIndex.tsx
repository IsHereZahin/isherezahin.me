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
            {/* Header Section */}
            <section className="mb-20 space-y-8">
                <PageTitle title="My Daily Uses" subtitle="A peek into my workspace and the tools that power my creative workflow." />
                {/* Hero Image / Setup Shot */}
                <ImageZoom>
                    <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl bg-secondary cursor-zoom-in">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
                        {/* Image */}
                        <BlurImage
                            src={DeskImage}
                            alt="Workspace Setup"
                            className="rounded-2xl"
                        />
                        {/* Badges */}
                        <div className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-2">
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

                        {/* Decorative gradient blur */}
                        <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
                    </div>
                </ImageZoom>
            </section>

            {/* Workstation - Bento Grid Layout */}
            <section id="workstation" className="mb-24 scroll-mt-24">
                <SectionHeader tag="01" title="Hardware" subtitle="The computing power behind the pixels." />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
                    {/* Main Computer - Large Card */}
                    <div className="group relative col-span-1 md:col-span-2 md:row-span-2 overflow-hidden rounded-2xl md:rounded-3xl shadow-feature-card p-8 transition-all duration-300">
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 shadow-feature-card group-hover:bg-foreground/10 transition-colors">
                                    <Laptop className="h-5 w-5 text-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">MacBook Pro 16"</h3>
                                <p className="text-base text-muted-foreground">M3 Max, 64GB RAM, 2TB SSD</p>
                            </div>
                            <div className="mt-8 space-y-4">
                                <p className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80">
                                    The absolute heart of my workflow. The M3 Max chip handles Docker containers, Figma renders, and
                                    video editing without spinning up the fans. Space Black finish, naturally.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <SpecBadge icon={Cpu} label="16-Core CPU" />
                                    <SpecBadge icon={Battery} label="22hr Battery" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
                    </div>

                    {/* Monitor */}
                    <div className="group relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl md:rounded-3xl shadow-feature-card p-8 transition-all duration-300">
                        <div className="flex h-full flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Monitor className="h-5 w-5 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold text-foreground">LG UltraFine 5K</h3>
                                </div>
                                <p className="text-base text-muted-foreground">27-inch IPS, 5120 x 2880</p>
                                <p className="text-xs text-muted-foreground max-w-xs group-hover:text-foreground/80">
                                    Pixel-perfect density for interface design. The matte finish helps with glare during the day.
                                </p>
                            </div>
                            <ImageZoom>
                                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-secondary shadow-feature-card group-hover:border-secondary/30 transition-colors">
                                    <BlurImage
                                        src={MonitorImage}
                                        alt="Monitor"
                                        className="object-cover opacity-60"
                                    />
                                </div>
                            </ImageZoom>
                        </div>
                    </div>

                    {/* Secondary Device 1 */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl shadow-feature-card p-6 transition-all duration-300">
                        <div className="space-y-4">
                            <HardDrive className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Samsung T7</h3>
                                <p className="text-xs text-muted-foreground group-hover:text-foreground/80">2TB Shield Edition</p>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Device 2 */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl shadow-feature-card p-6 transition-all duration-300">
                        <div className="space-y-4">
                            <Wifi className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Unifi Dream</h3>
                                <p className="text-xs text-muted-foreground group-hover:text-foreground/80">Router SE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Peripherals Section */}
            <section id="peripherals" className="mb-24 scroll-mt-24">
                <SectionHeader tag="02" title="Peripherals" subtitle="Input devices that make work feel like play." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Software Stack - Clean List */}
            <section id="stack" className="mb-24 scroll-mt-24">
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

            {/* Services / Subs - Compact Grid */}
            <section className="mb-12">
                <h3 className="mb-8 text-base font-medium uppercase tracking-wider text-muted-foreground">
                    Subscriptions & Services
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="flex items-center gap-1.5 rounded-full bg-secondary/5 px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-inset ring-secondary/20 hover:bg-secondary/10 transition-colors">
            <Icon className="h-3 w-3" />
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
        <div className="group rounded-2xl shadow-feature-card p-6 transition-all duration-300">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg shadow-feature-card bg-foreground/5 text-muted-foreground group-hover:text-foreground group-hover:bg-foreground/10 transition-colors">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <span className="mb-3 block text-xs font-medium text-secondary-foreground/70">{subtitle}</span>
            <p className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
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
        <div className="group flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between transition-all hover:bg-secondary/3 px-4 -mx-4 rounded-xl">
            <div className="flex items-start md:items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary dark:bg-accent/70 ring-1 ring-border group-hover:ring-secondary/30 transition-all">
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{name}</h4>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{category}</span>
                </div>
            </div>
            <p className="max-w-md text-base text-muted-foreground md:text-right group-hover:text-foreground/80 transition-colors">
                {description}
            </p>
        </div>
    )
}

function SubCard({ name, icon: Icon, price }: Readonly<{ name: string; icon: any; price: string }>) {
    return (
        <div className="flex items-center gap-3 rounded-lg shadow-feature-card p-4 transition-all">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div>
                <div className="text-base font-medium text-foreground">{name}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{price}</div>
            </div>
        </div>
    )
}