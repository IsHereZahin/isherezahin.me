import HomeIndex from "@/components/pages/home";
import { METADATA } from "@/config/seo.config";

export const metadata = METADATA.home;

export default function App() {
  return <HomeIndex />;
}
