interface Props {
  children: React.ReactNode;
}
const layout = ({ children }: Props) => {
  return (
    <div className="bg-muted flex flex-col p-6  md:p-10 justify-center items-center min-h-svh">
      <div className="w-full sm:max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};

export default layout;
