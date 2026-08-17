// src/data/pages/uses.ts
//
// Structure for the uses page: icons and images. All copy lives in
// `src/i18n/dictionaries` — `getUsesContent(dict)` merges the two.

import type { Dictionary } from "@/i18n/dictionaries/en";
import {
    Battery, Chrome, Code2, Command, Cpu, CreditCard, Database, Figma, HardDrive,
    Headphones, ImageIcon, Keyboard, Laptop, Monitor, Mouse, Music, Shield, Terminal, Wifi,
} from "lucide-react";
import deskImage from "../../../public/assets/images/uses/desk.jpg";
import monitorImage from "../../../public/assets/images/uses/monitor-screen-abstract.jpg";
import type {
    IconComponent, ImageSource, PageHeading, PeripheralEntry, SectionHeading,
    SoftwareEntry, SubscriptionEntry,
} from "../types";

/** Names are product names — the same in every language. */
const HARDWARE = {
    primary: { icon: Laptop, title: 'MacBook Pro 16"', specIcons: [Cpu, Battery] as IconComponent[] },
    display: { icon: Monitor, title: "LG UltraFine 5K", image: monitorImage as ImageSource },
    secondary: [
        { icon: HardDrive, title: "Samsung T7" },
        { icon: Wifi, title: "Unifi Dream" },
    ],
};

const PERIPHERALS = [
    { icon: Keyboard, title: "Keychron Q1 Pro" },
    { icon: Mouse, title: "Logitech MX Master 3S" },
    { icon: Headphones, title: "Sony WH-1000XM5" },
];

const SOFTWARE = [
    { icon: Code2, name: "VS Code" },
    { icon: Terminal, name: "Warp" },
    { icon: Figma, name: "Figma" },
    { icon: Chrome, name: "Arc Browser" },
    { icon: Database, name: "TablePlus" },
    { icon: Command, name: "Raycast" },
    { icon: Shield, name: "1Password" },
];

const SUBSCRIPTIONS = [
    { icon: Music, name: "Youtube Pro" },
    { icon: Code2, name: "Claude Pro" },
    { icon: ImageIcon, name: "Midjourney" },
    { icon: CreditCard, name: "Setapp" },
];

export interface UsesContent {
    heading: PageHeading;
    hero: { image: ImageSource; alt: string; badges: string[] };
    hardware: {
        heading: SectionHeading;
        primary: { icon: IconComponent; title: string; subtitle: string; description: string; specs: { icon: IconComponent; label: string }[] };
        display: { icon: IconComponent; title: string; subtitle: string; description: string; image: ImageSource; imageAlt: string };
        secondary: { icon: IconComponent; title: string; subtitle: string }[];
    };
    peripherals: { heading: SectionHeading; items: PeripheralEntry[] };
    software: { heading: SectionHeading; items: SoftwareEntry[] };
    subscriptions: { title: string; items: SubscriptionEntry[] };
}

export function getUsesContent(dict: Dictionary): UsesContent {
    const t = dict.uses;

    return {
        heading: t.heading,
        hero: { image: deskImage as ImageSource, alt: t.hero.alt, badges: [...t.hero.badges] },
        hardware: {
            heading: { tag: "01", title: t.hardware.title, subtitle: t.hardware.subtitle },
            primary: {
                ...HARDWARE.primary,
                subtitle: t.hardware.primary.subtitle,
                description: t.hardware.primary.description,
                specs: t.hardware.primary.specs.map((label, i) => ({ icon: HARDWARE.primary.specIcons[i], label })),
            },
            display: {
                ...HARDWARE.display,
                subtitle: t.hardware.display.subtitle,
                description: t.hardware.display.description,
                imageAlt: t.hardware.display.imageAlt,
            },
            secondary: HARDWARE.secondary.map((item, i) => ({ ...item, subtitle: t.hardware.secondary[i].subtitle })),
        },
        peripherals: {
            heading: { tag: "02", title: t.peripherals.title, subtitle: t.peripherals.subtitle },
            items: PERIPHERALS.map((item, i) => ({ ...item, ...t.peripherals.items[i] })),
        },
        software: {
            heading: { tag: "03", title: t.software.title, subtitle: t.software.subtitle },
            items: SOFTWARE.map((item, i) => ({ ...item, ...t.software.items[i] })),
        },
        subscriptions: {
            title: t.subscriptions.title,
            items: SUBSCRIPTIONS.map((item, i) => ({ ...item, plan: t.subscriptions.plans[i] })),
        },
    };
}
