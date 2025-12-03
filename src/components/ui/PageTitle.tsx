import MotionWrapper from "../motion/MotionWrapper";
import Heading from "./Heading";

type PageTitleProps = {
  title: string;
  subtitle: string;
};

export default function PageTitle({ title, subtitle }: Readonly<PageTitleProps>) {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <MotionWrapper direction="top">
        <Heading text={title} />
      </MotionWrapper>
      <MotionWrapper direction="top" delay={0.1}>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-colors bg-gradient-to-r from-foreground/[35%] via-foreground/90 to-foreground/[35%] bg-clip-text text-transparent">{subtitle}</p>
      </MotionWrapper>
    </div>
  );
}