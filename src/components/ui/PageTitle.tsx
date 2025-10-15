import MotionWrapper from "../motion/MotionWrapper";

type PageTitleProps = {
  title: string;
  subtitle: string;
};

export default function PageTitle({ title, subtitle }: Readonly<PageTitleProps>) {
  return (
    <div className="text-center">
      <MotionWrapper direction="top">
        <h1 className="my-4 font-semibold text-4xl sm:text-5xl">{title}</h1>
      </MotionWrapper>
      <MotionWrapper direction="top" delay={0.1}>
        <h2 className="mb-8 text-secondary-foreground">{subtitle}</h2>
      </MotionWrapper>
    </div>
  );
}