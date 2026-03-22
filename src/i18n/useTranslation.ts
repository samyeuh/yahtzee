import { useYahtzeeContext } from '../context/YahtzeeContext/YahtzeeContext';
import en from './en.json';
import fr from './fr.json';

const translations = { en, fr };

export function useTranslation() {
    const { settings } = useYahtzeeContext();
    const t = translations[settings.language];
    return { t };
}