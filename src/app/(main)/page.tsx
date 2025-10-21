import HomeIndex from '@/components/pages/HomeIndex';
import { MY_FULL_NAME } from '@/lib/constants';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Home | ${MY_FULL_NAME}`,
};

export default function App() {
  return (
    <HomeIndex />
  )
}