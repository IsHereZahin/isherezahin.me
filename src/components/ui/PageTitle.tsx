import MotionWrapper from "../motion/MotionWrapper";
import Heading from "./Heading";

type PageTitleProps = {
  title: string;
  subtitle: string;
};

export default function PageTitle({ title, subtitle }: Readonly<PageTitleProps>) {
  return (
    <div className="text-center">
      <MotionWrapper direction="top">
        <Heading text={title} />
      </MotionWrapper>
      <MotionWrapper direction="top" delay={0.1}>
        <h2 className="mb-8 transition-colors bg-gradient-to-r from-foreground/[35%] via-foreground/90 to-foreground/[35%] bg-clip-text text-transparent">{subtitle}</h2>
      </MotionWrapper>
    </div>
  );
}