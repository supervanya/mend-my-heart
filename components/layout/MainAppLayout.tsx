import { usePersona } from "@/helpers/useLastActiveChat";

interface MainAppLayoutProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  main: React.ReactNode;
}

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({
  footer,
  header,
  main,
}) => {
  const { persona, personaName, setPersona } = usePersona();
  const { greeting, oneLiner, colors } = persona;
  const { background, dark, light } = colors;

  return (
    <div className="flex h-[100dvh] flex-col transition-colors duration-500">
      <nav style={{ backgroundColor: colors.dark }}>{header}</nav>
      <main
        className="flex-1 overflow-auto overscroll-contain"
        style={{ backgroundColor: colors.background }}
      >
        {main}
      </main>
      <footer style={{ backgroundColor: colors.dark }}>{footer}</footer>
    </div>
  );
};
