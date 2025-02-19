import { toString } from 'mdast-util-to-string';

interface ReadingTimeResult {
  minutes: number;
  words: number;
  characters: number;
  chineseCharacters: number;
  englishWords: number;
}

export function getReadingTime(text: string): ReadingTimeResult {
  
  // Count Chinese characters (including punctuation)
  const chineseRegex = /[\u4E00-\u9FA5]/g;
  const chineseCharacters = text.match(chineseRegex)?.length || 0;
  
  // Remove Chinese characters and normalize spaces
  const englishText = text.replace(chineseRegex, ' ').replace(/\s+/g, ' ').trim();
  const englishWords = englishText ? text.split(/\s+/).filter(Boolean).length : 0;
  
  // Total character count (excluding whitespace)
  const characters = text.replace(/\s/g, '').length;
  
  // Calculate reading time
  // Chinese: 300 characters per minute (standard reading speed)
  // English: 200 words per minute (average reading speed)
  const chineseMinutes = chineseCharacters / 300;
  const englishMinutes = englishWords / 200;
  
  // Total reading time rounded up to nearest minute, minimum 1 minute
  const minutes = Math.max(1, Math.ceil(chineseMinutes + englishMinutes));
  
  return {
    minutes,
    words: englishWords + chineseCharacters,
    characters,
    chineseCharacters,
    englishWords,
  };
}