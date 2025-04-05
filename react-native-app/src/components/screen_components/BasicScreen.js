import Title from "./Title";

import BasicScreenTemplate from "./BasicScreenTemplate";

export default function BasicScreen({ children, title, language, subtitle }) {
    return (
        <BasicScreenTemplate
            HeaderComponent={<Title title={title} subtitle={subtitle || defaultSubtitle[language]} />}
        >
            {children}
        </BasicScreenTemplate>
    );
}

const defaultSubtitle = {
    en: 'Always with you - anywhere, anytime',
    he: 'תמיד איתך - בכל מקום, בכל שעה',
}