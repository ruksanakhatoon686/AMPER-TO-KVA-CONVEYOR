import React from 'react';
import type { OptionType, LocationValue, ShiftValue, VoltageValue, NavItem } from './types';

// SVG Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TrainingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const UpdatesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;


export const SHIFT_OPTIONS: OptionType<ShiftValue>[] = [
    { value: "Shift-A", label: "Shift-A" },
    { value: "Shift-B", label: "Shift-B" },
    { value: "Shift-C", label: "Shift-C" },
];

export const LOCATION_OPTIONS: OptionType<LocationValue>[] = [
    { value: "abb1", label: "ABB1-☎️326" },
    { value: "abb2", label: "ABB2-☎️327" },
    { value: "omra_ext", label: "Omra Ext-☎️307" },
    { value: "mallik_ext", label: "Mallik Ext-☎️320" },
    { value: "omra_ss", label: "Omra S/S-☎️350" },
    { value: "safa_malik_ss", label: "Safa Malik S/S-☎️378" },
    { value: "qrarah_ss", label: "Qrarah S/S-☎️607" },
];

export const VOLTAGE_OPTIONS: OptionType<VoltageValue>[] = [
    { value: "13800", label: "HT Voltage (13800 V)" },
    { value: "400", label: "Low Voltage (400 V)" },
];

// This is now for reference, as inputs are dynamic
export const LOCATION_INPUT_COUNT: Record<LocationValue, number> = {
    abb1: 2,
    abb2: 2,
    omra_ss: 2,
    qrarah_ss: 2,
    omra_ext: 3,
    mallik_ext: 3,
    safa_malik_ss: 4,
};

export const NAV_ITEMS: NavItem[] = [
    { id: "homeScreen", icon: <HomeIcon />, label: "Home", action: "navigate", target: "homeScreen" },
    { id: "mainCalculatorScreen", icon: <LocationIcon />, label: "Calculator", action: "navigate", target: "mainCalculatorScreen" },
    { id: "reportScreen", icon: <ReportIcon />, label: "Report", action: "navigate", target: "reportScreen" },
    { id: "historyScreen", icon: <HistoryIcon />, label: "History", action: "navigate", target: "historyScreen" },
    { id: "trainingScreen", icon: <TrainingIcon />, label: "Training", action: "navigate", target: "trainingScreen" },
    { id: "updates", icon: <UpdatesIcon />, label: "Updates", action: "open_url", target: "https://t.me/IqraApps" },
];
