import { ProfileLayout } from "@/components/pages/profile";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return <ProfileLayout>{children}</ProfileLayout>;
}
