type PageTitleProps = {
  title: string;
  subtitle: string;
};

export default function PageTitle({ title, subtitle }: Readonly<PageTitleProps>) {
  return (
    <div className="text-start">
      <h1 className="my-4 font-semibold text-3xl sm:text-4xl">{title}</h1>
      <h2 className="mb-8 text-secondary-foreground">{subtitle}</h2>
    </div>
  );
}