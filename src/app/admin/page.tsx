// hey developer if need to use admin dashboard, you can use this
import Section from '@/components/ui/Section';
import { MY_FULL_NAME } from '@/lib/constants';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Admin | ${MY_FULL_NAME}`,
};

export default function Admin() {
  return (
    <Section id="admin" animate >
      <h1>Admin Dashboard</h1>
    </Section>
  )
}