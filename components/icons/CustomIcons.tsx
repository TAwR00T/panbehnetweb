
import React from 'react';
import { motion } from 'framer-motion';

export const HomeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9.5L12 4L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z" fill="#FBCFE8"/>
        <path d="M9 21V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V21" fill="#F472B6"/>
        <path d="M3 9.5L12 4L21 9.5" stroke="#E53E98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 13V20H5V13" stroke="#E53E98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const Crown = () => (
     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 16L3 5L8.5 9.5L12 4L15.5 9.5L21 5L19 16H5Z" fill="#FDBA74" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 20H19" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const Gift = () => (
     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="9" width="18" height="12" rx="2" fill="#6EE7B7" stroke="#059669" strokeWidth="2"/>
        <path d="M12 9V21" stroke="#047857" strokeWidth="2"/>
        <path d="M3 9H21" stroke="#059669" strokeWidth="2"/>
        <path d="M16 5C16 3.34315 14.2091 2 12 2C9.79086 2 8 3.34315 8 5" fill="#A7F3D0" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const CustomBuildIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export const CheckCircle = ({ icon }) => (
    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600">
        {icon || <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
);

export const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
export const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
export const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
export const SpeedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14-4-4 4-4 4 4-4 4z"/><path d="M12 14v7"/><path d="M12 3v3"/></svg>;
export const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
export const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
export const TelegramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>;


export const TelegramLogoIcon = ({ className }) => (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M48.83 15.18a3.13 3.13 0 00-2.82-1.37H32A28.87 28.87 0 003.13 42.68 28.91 28.91 0 0032 60.87a28.87 28.87 0 0028.87-28.87c0-9.8-5-18.45-12.04-23.82z" fill="#2AABEE"></path>
        <path d="M48.83 15.18a3.13 3.13 0 00-2.82-1.37H32A28.87 28.87 0 003.13 42.68 28.91 28.91 0 0032 60.87a28.87 28.87 0 0028.87-28.87c0-9.8-5-18.45-12.04-23.82zM45.1 23.3l-10.4 9.92-1.37 7.82a1.08 1.08 0 01-1.6.61l-3.32-2.5-5.32 3.86a.82.82 0 01-1.3-.78l2.5-12.38 15.13-10.4a.69.69 0 01.9.83z" fill="#fff"></path>
    </svg>
);


// New Treasure Hunt Sticker-like Icons
const StickerWrapper = ({ children, gradientId, fromColor, toColor, ...props }) => (
    <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor={fromColor}/>
                <stop offset="1" stopColor={toColor}/>
            </linearGradient>
            <filter id="sticker-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
        </defs>
        <g style={{filter: 'url(#sticker-shadow)'}}>
            {children}
        </g>
    </svg>
);


export const TreasureKey = () => (
    <StickerWrapper gradientId="gold-gradient-key" fromColor="#FBBF24" toColor="#D97706">
        <path d="M51 29C51 35.0751 46.0751 40 40 40C33.9249 40 29 35.0751 29 29C29 22.9249 33.9249 18 40 18C46.0751 18 51 22.9249 51 29Z" fill="white" stroke="url(#gold-gradient-key)" strokeWidth="4"/>
        <path d="M35 34L15 54" stroke="url(#gold-gradient-key)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M22 47L19 50" stroke="url(#gold-gradient-key)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M27 42L24 45" stroke="url(#gold-gradient-key)" strokeWidth="5" strokeLinecap="round"/>
    </StickerWrapper>
);

export const TreasureCompass = () => (
    <StickerWrapper gradientId="blue-gradient-compass" fromColor="#38BDF8" toColor="#0284C7">
        <circle cx="32" cy="32" r="22" fill="white" stroke="url(#blue-gradient-compass)" strokeWidth="4"/>
        <path d="M32 18L37.1962 33L26.8038 33L32 18Z" fill="url(#blue-gradient-compass)"/>
        <path d="M32 46L26.8038 31L37.1962 31L32 46Z" fill="#E0F2FE"/>
        <circle cx="32" cy="32" r="3" fill="white" />
    </StickerWrapper>
);

export const TreasureChest = () => (
   <StickerWrapper gradientId="rose-gradient-chest" fromColor="#F472B6" toColor="#E11D48">
        <rect x="10" y="24" width="44" height="28" rx="6" fill="white" stroke="url(#rose-gradient-chest)" strokeWidth="4"/>
        <path d="M10 26C10 20.4772 14.4772 16 20 16H44C49.5228 16 54 20.4772 54 26V30H10V26Z" fill="white" stroke="url(#rose-gradient-chest)" strokeWidth="4"/>
        <rect x="29" y="32" width="6" height="8" rx="2" fill="url(#rose-gradient-chest)"/>
    </StickerWrapper>
);

export const TreasureParrot = () => (
    <StickerWrapper gradientId="green-gradient-parrot" fromColor="#4ADE80" toColor="#15803D">
        <path d="M32 12C23.1667 12 18.5 19.3333 18.5 25C18.5 34 27.5 45.5 32 49C36.5 45.5 45.5 34 45.5 25C45.5 19.3333 40.8333 12 32 12Z" fill="white" stroke="url(#green-gradient-parrot)" strokeWidth="4"/>
        <path d="M29 23C27.3431 23 26 24.3431 26 26C26 27.6569 27.3431 29 29 29" fill="url(#green-gradient-parrot)"/>
        <path d="M18.5 25C17 28 14 29.5 14 32C14 37 23 38 23 33" fill="#FBBF24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </StickerWrapper>
);