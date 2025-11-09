
import React, { useState, useCallback, useContext, createContext, useMemo, useEffect, ReactNode } from 'react';
import { SHIFT_OPTIONS, LOCATION_OPTIONS, VOLTAGE_OPTIONS, NAV_ITEMS } from './constants';
import type { ScreenID, ShiftValue, LocationValue, VoltageValue, LoadData, AppContextType, OptionType, HistoryEntry } from './types';
import { locationValues } from './types';

// --- CONTEXT ---
const AppContext = createContext<AppContextType | null>(null);

const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// --- HELPER COMPONENTS ---
const StyledButton: React.FC<{ onClick: (e?: React.MouseEvent) => void; children: ReactNode; className?: string; variant?: 'primary' | 'secondary' | 'clear' | 'default'; disabled?: boolean }> = ({ onClick, children, className = '', variant = 'default', disabled = false }) => {
    const baseClasses = 'w-full text-lg font-bold py-3 px-4 rounded-lg shadow-md transform transition-transform duration-150 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses = {
        primary: 'bg-[#00d4ff] text-[#1a1a2e] hover:bg-opacity-90 shadow-[#00d4ff]/30',
        secondary: 'bg-[#ff4081] text-white hover:bg-opacity-90 shadow-[#ff4081]/30',
        clear: 'bg-gray-600 text-white hover:bg-gray-500',
        default: 'bg-gray-700 text-white hover:bg-gray-600'
    };
    return <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

const StyledInput: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }> = ({ id, label, value, onChange, placeholder }) => (
     <div className='w-full mb-4'>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input type="number" id={id} placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-[#2a2a3a] border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:outline-none placeholder-gray-500" />
    </div>
);

const ScreenWrapper: React.FC<{ id: ScreenID; title: string; children: ReactNode; activeScreen: ScreenID; }> = ({ id, title, children, activeScreen }) => (
    <div id={id} className={`screen ${activeScreen === id ? 'visible' : ''} w-full min-h-full bg-[#1a1a2e] p-4 md:p-6 flex flex-col`}>
        {title && <h2 className="text-2xl font-bold text-center mb-6 text-[#00d4ff]">{title}</h2>}
        {children}
    </div>
);

// --- SCREEN COMPONENTS ---

const HomeScreen: React.FC = () => {
    const { setActiveScreen } = useAppContext();
    return (
        <ScreenWrapper id="homeScreen" title="" activeScreen="homeScreen">
            <div className="flex-grow flex flex-col justify-center items-center text-center">
                <h1 className="text-5xl font-extrabold text-[#00d4ff] animate-pulse-custom">⚡</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-white my-4">ALL STATIONS LOAD CALCULATOR</h2>
                <p className="text-xl text-[#00d4ff] mb-12">HT 3-Phase Ampere to kVA Converter</p>
                <div className="w-full max-w-xs">
                    <StyledButton onClick={() => setActiveScreen('mainCalculatorScreen')} variant="primary">Enter</StyledButton>
                </div>
            </div>
            <p className="text-center text-gray-500 mt-auto pb-16">Developed by Murtaza Ali</p>
        </ScreenWrapper>
    );
};

// --- MODAL COMPONENT ---
interface InputModalProps {
    config: { location: LocationValue, currents?: number[], entryId?: string };
    onClose: () => void;
    onCalculate: (data: { location: LocationValue, currents: number[], voltage: VoltageValue, entryId?: string, mode: 'close' | 'next' }) => void;
}

const InputModal: React.FC<InputModalProps> = ({ config, onClose, onCalculate }) => {
    const [currents, setCurrents] = useState<string[]>(config.currents ? config.currents.map(String) : ['']);
    const [voltageType, setVoltageType] = useState<VoltageValue>('13800');
    const locationLabel = useMemo(() => LOCATION_OPTIONS.find(o => o.value === config.location)?.label, [config.location]);
    
    const handleCurrentChange = (index: number, value: string) => {
        const newCurrents = [...currents];
        newCurrents[index] = value;
        setCurrents(newCurrents);

        if (value.trim()) {
            const num = parseFloat(value);
            if (!isNaN(num)) {
                const digits = Math.floor(Math.abs(num)).toString().length;
                if (digits === 2 && voltageType !== '13800') setVoltageType('13800');
                else if (digits >= 3 && voltageType !== '400') setVoltageType('400');
            }
        }
    };

    const handleAddInput = () => setCurrents([...currents, '']);
    
    const handleCalculate = (mode: 'close' | 'next') => {
        const numericCurrents = currents.map(c => parseFloat(c) || 0).filter(c => c > 0);
        if (numericCurrents.length === 0) {
            alert('Please enter at least one valid current value!');
            return;
        }
        onCalculate({ location: config.location, currents: numericCurrents, voltage: voltageType, entryId: config.entryId, mode });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-[#2a2a3a] rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[#00d4ff] text-center mb-4">{locationLabel}</h3>
                <div className="text-center mb-4 bg-[#1a1a2e] p-2 rounded">
                    <span className="font-semibold text-white">Voltage: {voltageType === '13800' ? 'HT (13.8kV)' : 'LT (400V)'}</span>
                </div>
                <div className="overflow-y-auto space-y-3 pr-2 flex-grow">
                    {currents.map((val, i) => (
                         <StyledInput key={i} id={`current_${i}`} label={`Tr ${i + 1} (Ampere)`} value={val} onChange={(e) => handleCurrentChange(i, e.target.value)} placeholder="Enter Current" />
                    ))}
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-3">
                    <StyledButton onClick={handleAddInput} variant="default">Add Input</StyledButton>
                    <StyledButton onClick={() => handleCalculate('next')} variant="primary">Next</StyledButton>
                </div>
            </div>
        </div>
    );
};

// --- NEW MAIN CALCULATOR SCREEN ---
const MainCalculatorScreen: React.FC = () => {
    const { activeScreen, shift, loadData, cumulativeKVA, addOrUpdateCalculation, editTarget, setEditTarget } = useAppContext();
    const [modalConfig, setModalConfig] = useState<{ location: LocationValue, currents?: number[], entryId?: string } | null>(null);

    useEffect(() => {
        if (editTarget) {
            setModalConfig({ location: editTarget.location, currents: editTarget.currents, entryId: editTarget.id });
            setEditTarget(null); // Consume the target
        }
    }, [editTarget, setEditTarget]);

    const handleOpenModal = (location: LocationValue) => {
        setModalConfig({ location });
    };

    const handleCalculate = (data: { location: LocationValue, currents: number[], voltage: VoltageValue, entryId?: string, mode: 'close' | 'next' }) => {
        addOrUpdateCalculation(data.location, data.currents, data.voltage, data.entryId);
        setModalConfig(null);
        if (data.mode === 'next') {
            const currentIndex = locationValues.indexOf(data.location);
            if (currentIndex < locationValues.length - 1) { // Check if not last location
                const nextIndex = currentIndex + 1;
                const nextLocation = locationValues[nextIndex];
                setTimeout(() => handleOpenModal(nextLocation), 100);
            }
        }
    };
    
    return (
        <ScreenWrapper id="mainCalculatorScreen" title="Load Calculator" activeScreen={activeScreen}>
            {modalConfig && <InputModal config={modalConfig} onClose={() => setModalConfig(null)} onCalculate={handleCalculate} />}
            <div className="text-center text-lg font-semibold bg-[#2a2a3a] p-3 rounded-lg mb-4 text-[#00d4ff]">Shift: {shift}</div>
            <div className="text-center text-2xl font-bold text-green-400 mb-4 py-3 bg-[#2a2a3a] rounded-lg">Total kVA: {cumulativeKVA}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-grow pb-16">
                {LOCATION_OPTIONS.map(loc => (
                    <button key={loc.value} onClick={() => handleOpenModal(loc.value)} className="bg-[#2a2a3a] p-4 rounded-lg text-left shadow-lg hover:bg-[#3a3a4a] transition-colors duration-200">
                        <p className="text-lg font-bold text-white">{loc.label}</p>
                        <p className="text-md text-[#00d4ff]">{loadData[loc.value].toFixed(1)} kVA</p>
                    </button>
                ))}
            </div>
        </ScreenWrapper>
    );
};


// --- HISTORY SCREEN ---
const HistoryScreen: React.FC = () => {
    const { history, setActiveScreen, setEditTarget, activeScreen, clearAll } = useAppContext();

    const handleEdit = (entry: HistoryEntry) => {
        setEditTarget(entry);
        setActiveScreen('mainCalculatorScreen');
    };

    return (
        <ScreenWrapper id="historyScreen" title="24-Hour History" activeScreen={activeScreen}>
            {history.length > 0 && (
                <div className="mb-4">
                    <StyledButton onClick={clearAll} variant="clear">Clear All History</StyledButton>
                </div>
            )}
            <div className="flex-grow space-y-3 overflow-y-auto pb-16">
                {history.length === 0 ? (
                    <p className="text-gray-400 text-center pt-20">No calculations in the last 24 hours.</p>
                ) : (
                    [...history].reverse().map(entry => {
                        const locationLabel = LOCATION_OPTIONS.find(o => o.value === entry.location)?.label || entry.location;
                        return (
                            <div key={entry.id} className="bg-[#2a2a3a] p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-white">{locationLabel}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(entry.timestamp).toLocaleTimeString()} - {entry.kva.toFixed(1)} kVA
                                    </p>
                                    <p className="text-xs text-gray-500">Amps: [{entry.currents.join(', ')}]</p>
                                </div>
                                <StyledButton onClick={() => handleEdit(entry)} className="w-auto px-4 py-1 text-sm" variant='default'>Edit</StyledButton>
                            </div>
                        );
                    })
                )}
            </div>
        </ScreenWrapper>
    );
};


const ReportScreen: React.FC = () => {
    const { loadData, shift } = useAppContext();
    const [reportText, setReportText] = useState('');

    useEffect(() => {
        const total = Object.values(loadData).reduce((s, v) => s + Math.floor(v), 0);
        const now = new Date();
        const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        
        let report = `Daily Load Report\nDate  ${date}\nTime  ${time}\n${shift}\n`;
        
        for (const key in loadData) {
            if (loadData[key as LocationValue] > 0) {
                const opt = LOCATION_OPTIONS.find(o => o.value === key);
                const name = opt ? opt.label.split('-')[0].trim() : key;
                report += `${name.padEnd(15)}: ${Math.floor(loadData[key as LocationValue]).toString().padStart(5)} KVA\n`;
            }
        }
        report += `\nTotal Load:     ${total} KVA`;
        setReportText(report);
    }, [loadData, shift]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(reportText)
            .then(() => alert('Report copied to clipboard!'))
            .catch(err => alert('Failed to copy: ' + err));
    };

    return (
        <ScreenWrapper id="reportScreen" title="Daily Load Report" activeScreen={useAppContext().activeScreen}>
            <div className="flex-grow w-full max-w-md mx-auto bg-[#2a2a3a] p-4 rounded-lg shadow-lg mb-6 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-white font-mono text-sm">{reportText}</pre>
            </div>
            <div className="w-full max-w-md mx-auto">
                <StyledButton onClick={copyToClipboard} variant='primary'>Copy to Clipboard</StyledButton>
            </div>
        </ScreenWrapper>
    );
};

const TrainingScreen: React.FC = () => {
    return (
        <ScreenWrapper id="trainingScreen" title="App Training Guide" activeScreen={useAppContext().activeScreen}>
            <div className="text-gray-300 space-y-4 bg-[#2a2a3a] p-4 rounded-lg prose prose-invert">
                 <p><strong>Welcome to the new Load Calculator!</strong></p>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Calculator Screen</strong>: This is your main screen. Tap any location to start entering data.</li>
                    <li><strong>Input Pop-up</strong>: After tapping a location, a pop-up appears. Enter the current for "Tr 1".
                        <ul className="list-disc list-inside ml-4">
                            <li>Click <strong>Add Input</strong> to add more fields (Tr 2, Tr 3...).</li>
                            <li><strong>Next</strong> saves the data and automatically opens the pop-up for the next location in the list.</li>
                             <li>The pop-up closes automatically after the last location. You can also close it by tapping the background.</li>
                        </ul>
                    </li>
                    <li><strong>History Screen</strong>: View all calculations from the last 24 hours. Click "Edit" to modify an entry.</li>
                    <li><strong>Report Screen</strong>: Generates a cumulative report of all locations with calculated loads.</li>
                </ol>
            </div>
        </ScreenWrapper>
    );
};


// --- BOTTOM NAV BAR ---
const BottomNavBar: React.FC = () => {
    const { activeScreen, setActiveScreen } = useAppContext();
    const handleNav = (item: (typeof NAV_ITEMS)[0]) => {
        if (item.action === 'navigate') {
            setActiveScreen(item.target as ScreenID);
        } else if (item.action === 'open_url') {
            window.open(item.target, '_blank');
        }
    };
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#2a2a3a] border-t border-gray-700 flex justify-around shadow-lg z-10">
            {NAV_ITEMS.map(item => {
                const isActive = activeScreen === item.id;
                return (
                    <button key={item.id} onClick={() => handleNav(item)} className={`flex flex-col items-center justify-center p-2 w-full transition-colors duration-200 ${isActive ? 'text-[#00d4ff] bg-[#1a1a2e]' : 'text-gray-400 hover:text-white'}`}>
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

// --- APP PROVIDER & MAIN APP ---
const initialLoadData: LoadData = { abb1: 0, abb2: 0, omra_ext: 0, mallik_ext: 0, omra_ss: 0, safa_malik_ss: 0, qrarah_ss: 0 };

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeScreen, setActiveScreen] = useState<ScreenID>('homeScreen');
    const [shift, setShift] = useState<ShiftValue>('Shift-A');
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [editTarget, setEditTarget] = useState<HistoryEntry | null>(null);

    // Load and filter history from localStorage on initial load
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('loadHistory');
            if (savedHistory) {
                const parsedHistory: HistoryEntry[] = JSON.parse(savedHistory);
                const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
                const validHistory = parsedHistory.filter(entry => entry.timestamp >= twentyFourHoursAgo);
                setHistory(validHistory);
            }
        } catch (error) {
            console.error("Failed to load history:", error);
            setHistory([]);
        }

        // Auto-detect shift
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 6 && hour < 14) setShift('Shift-A');
        else if (hour >= 14 && hour < 22) setShift('Shift-B');
        else setShift('Shift-C');
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('loadHistory', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save history:", error);
        }
    }, [history]);

    const { loadData, cumulativeKVA } = useMemo(() => {
        const newLoadData = { ...initialLoadData };
        let totalKVA = 0;
        // Sum up the kVA for each location based on the latest entry in history
        const latestEntries: Record<string, HistoryEntry> = {};
        for (const entry of history) {
            latestEntries[entry.location] = entry; // Simple override to get the latest, better would be to check timestamp
        }
        
        const latestHistoryByLocation = locationValues.reduce((acc, loc) => {
             const entriesForLoc = history.filter(h => h.location === loc);
             if (entriesForLoc.length > 0) {
                 acc[loc] = entriesForLoc.reduce((latest, current) => current.timestamp > latest.timestamp ? current : latest);
             }
             return acc;
        }, {} as Record<LocationValue, HistoryEntry>);
        
        Object.values(latestHistoryByLocation).forEach(entry => {
            newLoadData[entry.location] = (newLoadData[entry.location] || 0) + entry.kva;
        });

        totalKVA = Object.values(newLoadData).reduce((sum, kva) => sum + kva, 0);

        return { loadData: newLoadData, cumulativeKVA: Math.floor(totalKVA) };
    }, [history]);
    

    const addOrUpdateCalculation = useCallback((location: LocationValue, currents: number[], voltage: VoltageValue, entryId?: string) => {
        const totalCurrent = currents.reduce((sum, current) => sum + current, 0);
        const voltageNum = parseFloat(voltage);
        const kva = (Math.sqrt(3) * voltageNum * totalCurrent) / 1000;

        setHistory(prevHistory => {
            if (entryId) { // Editing existing entry
                return prevHistory.map(entry => entry.id === entryId ? { ...entry, currents, voltage, kva, timestamp: Date.now() } : entry);
            } else { // Adding new entry
                const newEntry: HistoryEntry = { id: `${Date.now()}-${location}`, timestamp: Date.now(), location, currents, voltage, kva };
                return [...prevHistory, newEntry];
            }
        });
    }, []);

    const clearAll = useCallback(() => {
        if(window.confirm("Are you sure you want to clear all data and history?")) {
            setHistory([]);
            setActiveScreen('mainCalculatorScreen');
        }
    }, []);

    const value: AppContextType = {
        activeScreen,
        setActiveScreen,
        shift,
        setShift,
        loadData,
        cumulativeKVA,
        history,
        addOrUpdateCalculation,
        clearAll,
        editTarget,
        setEditTarget,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const MainApp: React.FC = () => {
    const { activeScreen } = useAppContext();

    const screens: Record<ScreenID, React.ReactElement> = {
        homeScreen: <HomeScreen />,
        mainCalculatorScreen: <MainCalculatorScreen />,
        reportScreen: <ReportScreen />,
        historyScreen: <HistoryScreen />,
        trainingScreen: <TrainingScreen />,
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            <main className="flex-grow overflow-y-auto">
                {screens[activeScreen]}
            </main>
            <BottomNavBar />
        </div>
    );
}

const App: React.FC = () => {
    return (
        <AppProvider>
            <MainApp />
        </AppProvider>
    );
};

export default App;
