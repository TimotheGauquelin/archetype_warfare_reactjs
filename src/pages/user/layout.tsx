import Header from "../../components/generic/header/Header";
import Footer from "@/components/generic/footer/Footer";
import Hero from "@/components/generic/Hero";

const UserBasicLayout = ({
  mainTitle,
  subTitle,
  children,
  showHero = true,
}: {
  mainTitle: string;
  subTitle: string;
  children: React.ReactNode;
  showHero?: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <div className="imgBackground overflow-visible">
        <Header />
        {showHero && <Hero mainTitle={mainTitle} subTitle={subTitle} />}
      </div>
      <main className="relative w-full max-w-containerSize mx-auto">
        {children && children}
      </main>
      <Footer />
    </div>
  );
};

export default UserBasicLayout;
