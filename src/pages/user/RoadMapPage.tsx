import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import PageContentBlock from '../../components/generic/PageContentBlock'
import RevealOnScroll from '../../components/generic/RevealOnScroll'
import UserHeroLayout from './layout'

const RoadMapPage = () => {
    const { t } = useTranslation()

    const quarters = useMemo(() => [
        {
            period: t("roadmap.q0.period"),
            dates: t("roadmap.q0.dates"),
            color: "from-gray-200 via-gray-100 to-purple-200 bg-gradient-to-b",
            titleColor: "text-gray-700",
            items: t("roadmap.q0.items", { returnObjects: true }) as string[],
        },
        {
            period: t("roadmap.q1.period"),
            dates: t("roadmap.q1.dates"),
            color: "bg-blue-100",
            titleColor: "text-blue-700",
            items: t("roadmap.q1.items", { returnObjects: true }) as string[],
        },
        {
            period: t("roadmap.q2.period"),
            dates: t("roadmap.q2.dates"),
            color: "bg-green-100",
            titleColor: "text-green-700",
            items: t("roadmap.q2.items", { returnObjects: true }) as string[],
        },
        {
            period: t("roadmap.q3.period"),
            dates: t("roadmap.q3.dates"),
            color: "bg-yellow-100",
            titleColor: "text-yellow-700",
            items: t("roadmap.q3.items", { returnObjects: true }) as string[],
        },
        {
            period: t("roadmap.q4.period"),
            dates: t("roadmap.q4.dates"),
            color: "bg-purple-100",
            titleColor: "text-purple-700",
            items: t("roadmap.q4.items", { returnObjects: true }) as string[],
        },
    ], [t])

    return (
        <UserHeroLayout
            mainTitle={t("hero.roadmap.title")}
            subTitle={t("hero.roadmap.subtitle")}
        >
            <PageContentBlock>
                <div className="flex flex-col w-full justify-center max-w-containerSize m-auto">
                    <h1 className="text-2xl font-bold mb-8 text-center">{t("roadmap.pageTitle")}</h1>

                    <div className="space-y-6">
                        {quarters.map((quarter, index) => (
                            <RevealOnScroll
                                key={index}
                                as="section"
                                className={`rounded-xl p-6 ${quarter.color} shadow-sm`}
                            >
                                <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between mb-4">
                                    <h2 className={`text-2xl tablet:text-3xl font-extrabold ${quarter.titleColor}`}>
                                        {quarter.period}
                                    </h2>
                                    <span className="text-gray-600 font-medium mt-2 sscreen:mt-0">
                                        {quarter.dates}
                                    </span>
                                </div>

                                <ul className="space-y-2 mt-4">
                                    {quarter.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-start">
                                            <span className="text-gray-600 mr-2">•</span>
                                            <span className="text-gray-800">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </PageContentBlock>
        </UserHeroLayout>
    )
}

export default RoadMapPage
