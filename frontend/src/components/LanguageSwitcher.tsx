import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const toggle = () => i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko');

  return <button onClick={toggle}>{i18n.language.toUpperCase()}</button>;
};