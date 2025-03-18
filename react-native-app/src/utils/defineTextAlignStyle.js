export default function defineTextAlignStyle(language, style_current) {
    const textAlign = language === 'en' ? 'left' : 'right';
    return [{ textAlign }, style_current];
}