"use client"
import { ALL_MODES, KEYS } from "@/lib/constants";
import { useEffect, useState } from "react";

export function UseGenerateRandomKeyAndMode() {
    const [currentKey, setCurrentKey] = useState(KEYS[0])
    const [currentMode, setCurrentMode] = useState(ALL_MODES[0])
    const [usedKeys, setUsedKeys] = useState<boolean[]>(new Array(12).fill(true))
    const [usedModes, setUsedModes] = useState<boolean[]>(new Array(14).fill(true))
    const [countofCombinations, setCountOfCombinations] = useState(0);
    const [Combinations, setCombinations] = useState<Array<{ keyIndex: number; modeIndex: number }>>([]);
    const [selectedModes, setSelectedModes] = useState<string[]>(ALL_MODES.slice(0, 7))
    const [index, setindex] = useState(0);
    useEffect(() => {
        setCombinations([]);
        setUsedModes(new Array(14).fill(true))
        setUsedKeys(new Array(12).fill(true))
        setCountOfCombinations(getRemainingCombinations());
        getAvialableCombinations()
    }, [selectedModes])
    useEffect(() => {
        if (Combinations.length !== 0) {
            generateRandomKeyAndMode2();
        }
    }, [Combinations])


    const getRemainingCombinations = () => {
        const availableModes = selectedModes.length > 0 ? selectedModes : ALL_MODES;
        let remainingCount = availableModes.length * KEYS.length;
        return remainingCount;
    }
    const getAvialableCombinations = () => {
        const availableModes = selectedModes.length > 0 ? selectedModes : ALL_MODES

        const availableKeyCombinations: Array<{ keyIndex: number; modeIndex: number }> = []
        KEYS.forEach((key, keyIndex) => {
            availableModes.forEach((mode, index) => {
                const modeIndex = ALL_MODES.indexOf(mode);
                if (usedKeys[keyIndex] || usedModes[modeIndex]) {
                    availableKeyCombinations.push({ keyIndex, modeIndex })
                }
            })
        });
        setCombinations(shuffleArray(availableKeyCombinations));
    }
    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    const generateRandomKeyAndMode2 = () => {
        console.log(index,countofCombinations,Combinations.length);
        if (index==Combinations.length && countofCombinations === 0) {
            setUsedKeys(new Array(12).fill(true))
            setUsedModes(new Array(14).fill(true))
            setCountOfCombinations(getRemainingCombinations());
            getAvialableCombinations();
            setindex(0);
            setCombinations(shuffleArray(Combinations));
        }
        const randomCombination = Combinations[index];
        if (randomCombination) {
            const selectedKey = KEYS[randomCombination.keyIndex]
            const selectedMode = ALL_MODES[randomCombination.modeIndex]
            setUsedKeys(prev => prev.map((val, i) => i === randomCombination.keyIndex ? false : val));
            setUsedModes(prev => prev.map((val, i) => i === randomCombination.modeIndex ? false : val));
            setCurrentKey(selectedKey)
            setCurrentMode(selectedMode)
            setCountOfCombinations((prev) => (prev > 0 ? prev - 1 : 0));
            setindex((prev) => prev + 1);
        }
    }
    const toggleModeSelection = (mode: string) => {
        setSelectedModes((prev) => (prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]))
    }

    const toggleAllModes = () => {
        setSelectedModes((prev) => (prev.length === ALL_MODES.length ? [] : ALL_MODES))
    }

    return { generateRandomKeyAndMode2, currentKey, currentMode, countofCombinations, setSelectedModes, selectedModes, setUsedModes, setUsedKeys, setCountOfCombinations, getAvialableCombinations, usedKeys, usedModes, toggleAllModes, toggleModeSelection };
}
