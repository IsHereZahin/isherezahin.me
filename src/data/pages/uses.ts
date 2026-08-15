// src/data/pages/uses.ts
//
// Content for the uses page (`/uses`). Edit here — the sections in
// `src/components/pages/uses` only lay this out.

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
    Wifi,
} from "lucide-react";
import deskImage from "../../../public/assets/images/uses/desk.jpg";
import monitorImage from "../../../public/assets/images/uses/monitor-screen-abstract.jpg";
import type {
    IconComponent,
    ImageSource,
    PageHeading,
    PeripheralEntry,
    SectionHeading,
    SoftwareEntry,
    SubscriptionEntry,
} from "../types";

export const USES_PAGE_HEADING: PageHeading = {
    title: "My Daily Uses",
    subtitle: "A peek into my workspace and the tools that power my creative workflow.",
};

/** The wide setup shot below the page title. */
export const USES_HERO = {
    image: deskImage as ImageSource,
    alt: "Workspace Setup",
    /** Small pills in the bottom-left corner of the photo. */
    badges: ["Updated Nov 2025", "Home Office"],
};

export const USES_HARDWARE: {
    heading: SectionHeading;
    primary: {
        icon: IconComponent;
        title: string;
        subtitle: string;
        description: string;
        specs: { icon: IconComponent; label: string }[];
    };
    display: {
        icon: IconComponent;
        title: string;
        subtitle: string;
        description: string;
        image: ImageSource;
        imageAlt: string;
    };
    secondary: { icon: IconComponent; title: string; subtitle: string }[];
} = {
    heading: {
        tag: "01",
        title: "Hardware",
        subtitle: "The computing power behind the pixels.",
    },
    primary: {
        icon: Laptop,
        title: 'MacBook Pro 16"',
        subtitle: "M3 Max, 64GB RAM, 2TB SSD",
        description:
            "The absolute heart of my workflow. The M3 Max chip handles Docker containers, Figma renders, and video editing without spinning up the fans. Space Black finish, naturally.",
        specs: [
            { icon: Cpu, label: "16-Core CPU" },
            { icon: Battery, label: "22hr Battery" },
        ],
    },
    display: {
        icon: Monitor,
        title: "LG UltraFine 5K",
        subtitle: "27-inch IPS, 5120 x 2880",
        description:
            "Pixel-perfect density for interface design. The matte finish helps with glare during the day.",
        image: monitorImage as ImageSource,
        imageAlt: "Monitor",
    },
    secondary: [
        { icon: HardDrive, title: "Samsung T7", subtitle: "2TB Shield Edition" },
        { icon: Wifi, title: "Unifi Dream", subtitle: "Router SE" },
    ],
};

export const USES_PERIPHERALS: {
    heading: SectionHeading;
    items: PeripheralEntry[];
} = {
    heading: {
        tag: "02",
        title: "Peripherals",
        subtitle: "Input devices that make work feel like play.",
    },
    items: [
        {
            icon: Keyboard,
            title: "Keychron Q1 Pro",
            subtitle: "Custom Build",
            description:
                "Lubed Boba U4T switches for that thocky sound. Aluminum frame adds satisfying weight.",
        },
        {
            icon: Mouse,
            title: "Logitech MX Master 3S",
            subtitle: "Pale Gray",
            description:
                "The electromagnetic wheel is a game changer for scrolling through long documentation.",
        },
        {
            icon: Headphones,
            title: "Sony WH-1000XM5",
            subtitle: "Noise Cancelling",
            description:
                "Essential for deep focus blocks. The transparency mode is surprisingly natural.",
        },
    ],
};

export const USES_SOFTWARE: {
    heading: SectionHeading;
    items: SoftwareEntry[];
} = {
    heading: {
        tag: "03",
        title: "Software",
        subtitle: "The virtual environment.",
    },
    items: [
        {
            icon: Code2,
            name: "VS Code",
            category: "Editor",
            description: "My customized editor with the 'Vesper' theme and 'Dank Mono' font.",
        },
        {
            icon: Terminal,
            name: "Warp",
            category: "Terminal",
            description:
                "Rust-based terminal that feels like a modern text editor. AI command search is clutch.",
        },
        {
            icon: Figma,
            name: "Figma",
            category: "Design",
            description:
                "Where all UI concepts start. I use it for wireframing, prototyping, and presentations.",
        },
        {
            icon: Chrome,
            name: "Arc Browser",
            category: "Browser",
            description:
                "Changed how I browse the web. Spaces and Boosts make it incredibly flexible.",
        },
        {
            icon: Database,
            name: "TablePlus",
            category: "Database",
            description: "The best GUI for managing SQL databases. Clean, native, and fast.",
        },
        {
            icon: Command,
            name: "Raycast",
            category: "Productivity",
            description:
                "Replaced Spotlight completely. Scripts, window management, and quick calculations.",
        },
        {
            icon: Shield,
            name: "1Password",
            category: "Security",
            description: "I don't know any of my passwords, and that's the way I like it.",
        },
    ],
};

export const USES_SUBSCRIPTIONS: {
    title: string;
    items: SubscriptionEntry[];
} = {
    title: "Subscriptions & Services",
    items: [
        { icon: Music, name: "Youtube Pro", plan: "Premium" },
        { icon: Code2, name: "Claude Pro", plan: "AI Assistant" },
        { icon: ImageIcon, name: "Midjourney", plan: "Standard" },
        { icon: CreditCard, name: "Setapp", plan: "Bundle" },
    ],
};
