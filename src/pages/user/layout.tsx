import Header from "../../components/generic/header/Header";
import Footer from "@/components/generic/footer/Footer";
import Hero from "@/components/generic/Hero";

const UserBasicLayout = ({ mainTitle, subTitle, children }: { mainTitle: string; subTitle: string, children: React.ReactNode }) => {
    return (
        <div className="flex flex-col">
            <div className="imgBackground overflow-visible">
                <Header />
                <Hero
                    mainTitle={mainTitle}
                    subTitle={subTitle}
                />
            </div>
            <div className="relative w-full max-w-containerSize mx-auto">
                {children && children}
            </div>
            <Footer />
        </div >
    );
};

export default UserBasicLayout;
