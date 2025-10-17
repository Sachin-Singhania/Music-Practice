import { CHORD_COLORS, CHORD_PROGRESSIONS } from "@/lib/constants";
import { createContext, useState } from "react";

interface MyContextType {
  selectedCircleKey: string | null;
  setSelectedCircleKey: React.Dispatch<React.SetStateAction<string | null>>;
  circleAnalysis: { roman: string; chord: string }[] | null;
  setCircleAnalysis: React.Dispatch<React.SetStateAction<{ roman: string; chord: string }[] | null>>;
  isMinorKey: (key: string) => boolean;
  getKeyTypeDisplay: (key: string) => string;
  handleCircleKeyClick: (key: string, isMinor?: boolean) => void;
  clearCircleSelection: () => void;
    getChordColor: (key: string, selectedCircleKey: string | null, circleAnalysis: any[] | null, CHORD_COLORS: string[]) => string | null;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);



export function MyKeySelectorForGuitarFretboardProvider({children} : { children:any}) {
   const [selectedCircleKey, setSelectedCircleKey] = useState<string | null>(null)
  const [circleAnalysis, setCircleAnalysis] = useState<{ roman: string; chord: string }[] | null>(null)
  const isMinorKey = (key: string) => {
    return key.includes("m") && !key.includes("°")
  }
  const getKeyTypeDisplay = (key: string) => {
    return isMinorKey(key) ? "minor" : "major"
  }
    const handleCircleKeyClick = (key: string, isMinor = false) => {
    setSelectedCircleKey(key)
    const progression = CHORD_PROGRESSIONS[key as keyof typeof CHORD_PROGRESSIONS]
    if (progression) {
      setCircleAnalysis(progression)
    }
  }

  const clearCircleSelection = () => {
    setSelectedCircleKey(null)
    setCircleAnalysis(null)
  }


const getChordColor = (key: string, selectedCircleKey: string | null, circleAnalysis: any[] | null, CHORD_COLORS: string[]): string | null => {
  if (!selectedCircleKey || !circleAnalysis) return null;
  const normalizeKey = (k: string): string[] => {
    if (k.includes('/')) {
      return k.split('/').map(part => part.trim());
    }
    return [k];
  };

  const getBaseNote = (chord: string): string => {
    return chord.replace(/[m°]/g, '');
  };

  const areEnharmonic = (key1: string, key2: string): boolean => {
    const enharmonicPairs: { [key: string]: string[] } = {
      'F#': ['Gb'],
      'Gb': ['F#'],
      'C#': ['Db'],
      'Db': ['C#'],
      'G#': ['Ab'],
      'Ab': ['G#'],
      'D#': ['Eb'],
      'Eb': ['D#'],
      'A#': ['Bb'],
      'Bb': ['A#'],
      'E#': ['F'],
      'F': ['E#'],
      'B#': ['C'],
      'C': ['B#'],
    };

    const base1 = getBaseNote(key1);
    const base2 = getBaseNote(key2);

    if (base1 === base2) return true;
    
    return enharmonicPairs[base1]?.includes(base2) || false;
  };
  // C Dm Em F G Am Bdim(we choose minor circle for colouring this one) (original chords)
  // C D E F G A B
  // All keys iterate and checks if Original chord matches with current key's variants or not
   const chordIndex = circleAnalysis.findIndex((chord) => {
    const chordName = chord.chord;
    const chordBase = getBaseNote(chordName);
    const keyVariants = normalizeKey(key);
    for (const keyVariant of keyVariants) {
      const keyBase = getBaseNote(keyVariant);
      
        if (chordName === keyVariant) return true;

      if (areEnharmonic(chordBase, keyBase)) {
        if (chordName.includes('°')) {
          if (keyVariant.endsWith('m')) {
            return true;
          }
        } else {
          const chordIsMinor = chordName.endsWith('m');
          const keyIsMinor = keyVariant.endsWith('m');
          
          if (chordIsMinor === keyIsMinor) {
            return true;
          }
        }
      }
    }
    
    // if (chordName.includes('/')) {
    //   const chordVariants = normalizeKey(chordName);
    //   for (const chordVariant of chordVariants) {
    //     for (const keyVariant of keyVariants) {
    //       const chordBase = getBaseNote(chordVariant);
    //       const keyBase = getBaseNote(keyVariant);
          
    //       if (chordVariant === keyVariant) return true;
    //       if (areEnharmonic(chordBase, keyBase)) {
    //         const chordIsMinor = chordVariant.endsWith('m');
    //         const keyIsMinor = keyVariant.endsWith('m');
    //         if (chordIsMinor === keyIsMinor) return true;
    //       }
    //     }
    //   }
    // }
    
    return false;
  });

  return chordIndex !== -1 ? CHORD_COLORS[chordIndex] : null;
};

  return (
        <MyContext.Provider value={{ selectedCircleKey,
    setSelectedCircleKey,
    circleAnalysis,
    setCircleAnalysis,
    isMinorKey,
    getKeyTypeDisplay,
    handleCircleKeyClick,
    clearCircleSelection,
    getChordColor }}>
      {children}
    </MyContext.Provider>
  )
}