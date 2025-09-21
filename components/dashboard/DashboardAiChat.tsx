
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanbehCharacterAnimated } from '../PanbehCharacterAnimated';
import { Button } from '../ui/button';
import { Send, ShieldCheck, ShoppingBag, ArrowLeft, X, Power, Link, RefreshCw, Clipboard, Check, LoaderCircle, WifiOff, Wifi, Award, Server, Cpu, Download } from 'lucide-react';
import { GoogleGenAI, Chat, Tool, FunctionDeclaration, Part } from '@google/genai';
import * as marzbanApi from './marzban-api';
import { DashboardView } from '../Dashboard';

// --- Gemini Setup ---
// In a real app, this key would be handled on a backend server, not exposed here.
// For this lab environment, we assume it's provided.
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;
const model = "gemini-2.5-flash";

// --- Tool & Instruction Definitions ---
const loggedInTools: Tool[] = [{
    functionDeclarations: [
        { name: 'get_user_status', description: 'Get subscription status (usage, expiry, hostname, lifetime usage, current server) for the logged-in user.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' } }, required: ['userName'] } },
        { name: 'get_connection_link', description: 'Get the subscription link and QR code for the logged-in user.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' } }, required: ['userName'] } },
        { name: 'create_subscription', description: 'Creates a new subscription for the logged-in user after payment confirmation.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' }, plan: { type: 'STRING' } }, required: ['userName', 'plan'] } },
        { name: 'reset_user_traffic', description: 'Resets data usage for the logged-in user.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' } }, required: ['userName'] } },
        { name: 'check_domain_ping_from_iran', description: 'Checks if a domain is reachable from Iran.', parameters: { type: 'OBJECT', properties: { domain: { type: 'STRING' } }, required: ['domain'] } },
        { name: 'revoke_and_renew_link', description: 'Revokes the user\'s current link and generates a new one.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' } }, required: ['userName'] } },
        { name: 'get_server_health', description: 'Checks the current health (load, response time) of a specific server.', parameters: { type: 'OBJECT', properties: { serverId: { type: 'STRING' } }, required: ['serverId'] } },
        { name: 'get_available_servers', description: 'Gets a list of all available servers the user can switch to.', parameters: { type: 'OBJECT', properties: {}, required: [] } },
        { name: 'switch_user_server', description: 'Switches the user to a new server configuration.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' }, serverId: { type: 'STRING' } }, required: ['userName', 'serverId'] } },
        { name: 'grant_reward', description: 'Grants a gamified reward (e.g., bonus traffic) to a user for a specific reason.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' }, reason: { type: 'STRING' } }, required: ['userName', 'reason'] } },
        { name: 'get_system_announcements', description: 'Gets the latest system-wide news and announcements.', parameters: { type: 'OBJECT', properties: {}, required: [] } },
        { name: 'log_unresolved_issue', description: 'Logs a detailed summary of an unresolved issue to create a support ticket.', parameters: { type: 'OBJECT', properties: { userName: { type: 'STRING' }, issueSummary: { type: 'STRING' } }, required: ['userName', 'issueSummary'] } },
        { name: 'get_client_download_links', description: 'Fetches the official client download links for all platforms.', parameters: { type: 'OBJECT', properties: {}, required: [] } },
    ] as FunctionDeclaration[]
}];

const guestTools: Tool[] = [{
    functionDeclarations: [
        { name: 'get_status_from_link', description: 'Get subscription status (usage, expiry, hostname) using a subscription link.', parameters: { type: 'OBJECT', properties: { link: { type: 'STRING', description: 'The subscription link.' } }, required: ['link'] } },
        { name: 'check_domain_ping_from_iran', description: 'Checks if a domain is reachable from Iran.', parameters: { type: 'OBJECT', properties: { domain: { type: 'STRING' } }, required: ['domain'] } },
        { name: 'get_client_download_links', description: 'Fetches the official client download links for all platforms.', parameters: { type: 'OBJECT', properties: {}, required: [] } },
    ] as FunctionDeclaration[]
}];


const loggedInSystemInstruction = `You are "Panbeh", a super-intelligent, proactive, and professional AI agent for Panbeh VPN. Your personality is an expert, helpful, and reassuring product specialist. ALWAYS speak in Persian. Use emojis like ☁️, ✨, 🎉, 🚀, 💡. You have a memory of the current conversation.

**=== CONVERSATIONAL MEMORY ===**
CRITICAL: You remember the context of the current conversation. If a user asks a follow-up question, answer it directly without asking for information they've already provided.

**=== CORE DIRECTIVE: PROACTIVE & PERSONALIZED GREETING ===**
This is your most important task. The user's first message will be "GENERATE_PROACTIVE_GREETING". You MUST perform a full system check and create a personalized, multi-part welcome message.
1.  **Check Status:** Call \`get_user_status\`.
2.  **Check News:** Call \`get_system_announcements\`.
3.  **Synthesize Greeting:** Combine this info into a warm, personalized greeting.
    *   **If subscription is expiring soon (<= 7 days):** Your FIRST sentence MUST be a warning. Example: "سلام [userName]، خوش برگشتی! ☁️ یه نگاهی به حسابت انداختم و دیدم که اشتراکت **فقط ۳ روز دیگه** اعتبار داره. برای اینکه ماجراجوییت قطع نشه، میتونی از الان تمدیدش کنی." Then, share news or offer help.
    *   **If OK:** "سلام [userName]، خوش برگشتی! ☁️ همه چیز مرتبه و اشتراکت فعاله. یه خبر خوب هم دارم! [Insert announcement here]. ✨"
4.  **Final Offer:** Always end the greeting with "امروز چطور میتونم کمکت کنم؟"
5.  **Gamification:** After the greeting, check the user's status for gamification. If \`lifetime_used_traffic_gb\` > 50 AND \`reward_granted_50gb\` is false, you MUST call \`grant_reward\` and announce it.

**=== SALES & SUBSCRIPTION FLOW (ACTIVE AGENT) ===**
*   **You are an active sales agent, not a guide.**
*   When a user wants to buy or renew ("میخوام بخرم", "تمدید کنم"):
    1.  **VALIDATION:** Check if \`userName\` contains only English letters (a-z, A-Z), numbers (0-9), and underscores (_).
    2.  **If INVALID** (e.g., "محمئی"):
        a. **DO NOT PROCEED.**
        b. **Generate a valid username** (e.g., "mohammadi").
        c. **Inform the user:** "برای اینکه بتونم برات اشتراک بسازم، نام کاربری شما در سیستم باید انگلیسی باشه. من یک نام کاربری جدید و استاندارد برای شما ساختم: **[new_generated_username]**. از این به بعد تمام کارهای اشتراک شما با این نام جدید انجام میشه."
        d. **Continue the sales flow with the NEW, VALID username.**
    3.  Ask which plan they want ("Pro", "Family").
    4.  Provide the payment link: "عالی! این لینک پرداخت شماست: [https://panbeh.vpn/pay/mock-link]. لطفاً بعد از پرداخت، همینجا بهم بگو 'پرداخت کردم' تا اشتراک رو فوراً برات فعال کنم."
    5.  On user confirmation ("پرداخت کردم"), call \`create_subscription\` with the **VALID** username and chosen plan.
    6.  Announce success: "فوق‌العاده‌ست! پرداخت شما تایید شد و پلن جدید برات فعال شد. از دنیای آزاد لذت ببر! 🎉"

**=== KNOWLEDGE & CREATIVITY ===**
*   **Dynamic Knowledge:** For information like download links, DO NOT use hardcoded info. **Always call the \`get_client_download_links\` tool** to get the most up-to-date links. This makes you seem more intelligent and connected.
*   **General VPN Questions:** Answer creatively. Explain what a VPN is in simple terms (e.g., "تونل امن", "شنل نامرئی دیجیتال"). Explain our No-Log policy with confidence.
*   **Basic Troubleshooting:** Before using tools, suggest simple fixes: "برنامه‌ات آپدیت هست؟", "یک بار حالت هواپیما رو روشن و خاموش کردی؟"

**=== ADVANCED TROUBLESHOOTING (Tool-based) ===**
*   **Connection Issues ("نمیتونم وصل شم"):**
    1. Call \`get_user_status\`. If inactive, guide to SALES flow.
    2. If active, get \`hostname\` and call \`check_domain_ping_from_iran\`.
    3. If ping fails, inform them the server is likely filtered and escalate.
    4. If ping succeeds, ask them to check their client version and then suggest renewing their link via \`revoke_and_renew_link\`.
*   **Speed Issues ("سرعتم کمه"):**
    1. First, ask which server they are on. Then, call \`get_server_health\`.
    2. If load is 'high', suggest switching. Call \`get_available_servers\` to show them the list.

**=== PROFESSIONAL ESCALATION ===**
*   If you cannot resolve an issue, summarize the problem and the steps you've taken. Call \`log_unresolved_issue\` with the details and inform the user a ticket has been created.
`;

const guestSystemInstruction = `You are "Panbeh", a creative, smart, and professional AI product specialist for Panbeh VPN. Your goal is to inform and help potential customers, guiding them towards a purchase. You are a creative AI with memory. ALWAYS speak in Persian. Use emojis like ☁️, ✨, 💡.

**=== CONVERSATIONAL MEMORY ===**
CRITICAL: You remember the context of the current conversation. If a user asks a follow-up question, answer it directly without asking for information they've already provided.

**=== CORE DIRECTIVE: GUEST SALES & ONBOARDING FLOW ===**
1.  **Warm Welcome:** "سلام! من پنبه هستم، دستیار هوشمند شما. ☁️ هر سوالی در مورد سرویس‌های ما، قیمت‌ها، یا حتی خود VPN داری، با خیال راحت بپرس!"
2.  **Educate & Excite:** When asked about plans or features, explain creatively. Compare plans based on their needs.
3.  **Guide to Purchase (The Funnel):**
    *   When a user wants to buy ("میخوام بخرم"), you MUST explain the next step.
    *   Say: "عالیه! برای اینکه اشتراک به نام خودت ساخته بشه، اولین قدم اینه که وارد حساب کاربریت بشی یا یک حساب جدید بسازی."
    *   Direct them to the main "شروع رایگان" or "ورود" button on the website.
    *   Crucially, end by telling them to RETURN to you after logging in. Say: "**بعد از اینکه وارد شدی، دوباره اینجا برگرد و بهم بگو که آماده‌ای تا خرید رو با هم کامل کنیم. منتظرتم!** ✨"

**=== KNOWLEDGE & CREATIVITY ===**
*   **Dynamic Knowledge:** For information like download links, **Always call the \`get_client_download_links\` tool** to get the most up-to-date links.
*   **General VPN Questions & Answers:** Answer creatively.
    *   Q: What is a VPN? A: "فکر کن اینترنت یک اتوبان شلوغه. VPN مثل یک ماشین شخصی ضدگلوله و با شیشه‌های دودی می‌مونه."
    *   Q: Do you keep logs? A: "اصلاً و ابداً! ما یک سیاست **عدم ثبت لاگ (No-Log)** خیلی جدی داریم."

**=== USING TOOLS (For Guests) ===**
*   Only use tools when a user explicitly asks for something a tool can do.
    *   If a user provides a subscription link to check, call \`get_status_from_link\`.
    *   If a user asks if a server is working, get the hostname from the link they provide and call \`check_domain_ping_from_iran\`.
`;


// --- Message Types ---
type MessageType = 'text' | 'typing' | 'status_card' | 'connection_card' | 'suggestion' | 'ping_card' | 'reward_card' | 'server_list_card';
interface Message {
    id: number;
    type: MessageType;
    isUser: boolean;
    content: any; // Can be string, or object for cards
}

// --- Rich Components ---
const QrCodePlaceholder = () => (
    <div className="w-40 h-40 bg-white p-2.5 rounded-2xl shadow-inner flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-80">
            <defs><pattern id="qr-pattern" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#4a044e" /><rect x="5" y="5" width="5" height="5" fill="#4a044e" /></pattern></defs>
            <rect width="100" height="100" fill="url(#qr-pattern)" /><rect x="10" y="10" width="20" height="20" fill="white" stroke="#4a044e" strokeWidth="5"/><rect x="70" y="10" width="20" height="20" fill="white" stroke="#4a044e" strokeWidth="5"/><rect x="10" y="70" width="20" height="20" fill="white" stroke="#4a044e" strokeWidth="5"/>
        </svg>
    </div>
);

const ConnectionCard = ({ link }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 border border-white/50 shadow-md text-right">
            <h4 className="font-bold text-gray-800 mb-3">لینک اتصال شما آماده‌ست!</h4>
            <div className="flex flex-col items-center gap-4">
                <QrCodePlaceholder />
                <p className="text-center text-xs text-gray-500">برای اتصال با موبایل، کد بالا رو اسکن کن.</p>
                <div className="relative w-full">
                    <input type="text" readOnly value={link} className="w-full bg-gray-100/80 border-2 border-gray-200/80 rounded-xl p-3 text-xs text-gray-500 truncate" />
                    <Button onClick={handleCopy} size="sm" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg bg-orange-500 text-white font-bold h-8 w-20">
                        {copied ? <Check size={16}/> : 'کپی'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ status }) => (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 border border-white/50 shadow-md text-right">
        <h4 className="font-bold text-gray-800 mb-3">اینم از وضعیت اشتراکت:</h4>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center"><span className="text-gray-500">وضعیت:</span> <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${status.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status.status === 'active' ? 'فعال' : 'غیرفعال'}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">حجم مصرفی:</span> <span className="font-bold text-gray-800">{status.used_traffic_gb.toFixed(2)} GB</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">حجم کل:</span> <span className="font-bold text-gray-800">{status.data_limit_gb} GB</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">روزهای باقیمانده:</span> <span className="font-bold text-gray-800">{status.days_left} روز</span></div>
        </div>
    </div>
);

const PingCard = ({ payload }) => (
     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 border border-white/50 shadow-md text-right">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 justify-end">
            نتیجه بررسی پینگ
            <Power size={18} />
        </h4>
        <div className="space-y-2 text-sm">
             <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-gray-500">دامنه سرور:</span>
                <span className="text-gray-600 truncate">{payload.domain}</span>
            </div>
             <div className={`flex justify-between items-center p-2 rounded-lg ${payload.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className="font-bold">{payload.success ? 'وضعیت' : 'وضعیت'}</span>
                <span className={`font-bold flex items-center gap-1 ${payload.success ? 'text-green-700' : 'text-red-700'}`}>
                    {payload.success ? <Wifi size={16}/> : <WifiOff size={16}/>}
                    {payload.success ? 'از ایران در دسترس است' : 'از ایران در دسترس نیست'}
                </span>
            </div>
        </div>
    </div>
);

const RewardCard = ({ payload }) => (
    <div className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl p-4 border border-yellow-400/50 shadow-lg text-right overflow-hidden relative">
        <div className="absolute -top-4 -right-4 w-16 h-16 text-yellow-600 opacity-20">
            <Award size={64}/>
        </div>
        <div className="relative z-10">
            <h4 className="font-black text-lg text-yellow-800">{payload.title}</h4>
            <p className="text-sm text-yellow-900/80 mt-1">{payload.description}</p>
        </div>
    </div>
);

const ServerListCard = ({ payload, onSwitchServer }) => (
     <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 border border-white/50 shadow-md text-right">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 justify-end">
           لیست سرورهای موجود
           <Server size={18} />
        </h4>
        <div className="space-y-2">
            {payload.map(server => (
                <div key={server.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-100/70">
                    <div className="font-semibold text-gray-700 flex items-center gap-2">
                        <span>{server.location}</span>
                        <span>{server.name}</span>
                        <span className={`text-xs font-bold ${server.health === 'Good' ? 'text-green-600' : (server.health === 'High Load' ? 'text-red-600' : 'text-orange-600')}`}>({server.health})</span>
                    </div>
                    <Button onClick={() => onSwitchServer(server.id)} size="sm" className="bg-purple-600 text-white font-bold rounded-lg px-3 py-1.5 text-xs">تغییر</Button>
                </div>
            ))}
        </div>
    </div>
);


const SuggestionButton = ({ text, icon, onClick, delay = 0 }: { text: string, icon: React.ReactNode, onClick: () => void, delay?: number }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 + delay }}
        whileHover={{ y: -3, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex items-center gap-3 text-left w-full p-4 bg-white/60 backdrop-blur-lg rounded-2xl shadow-md border border-white/50 hover:border-purple-300/80 transition-all"
    >
        <div className="p-3 bg-white/60 rounded-full shadow-inner text-purple-600">{icon}</div>
        <span className="font-bold text-gray-700">{text}</span>
    </motion.button>
);

const MessageRenderer = ({ msg, onSwitchServer }: { msg: Message, onSwitchServer: (id: string) => void }) => {
    const { type, isUser, content } = msg;

    if (type === 'typing') {
         return (
             <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 flex-shrink-0 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-white">
                    <PanbehCharacterAnimated size={25} float={false} expression="writing" />
                </div>
                 <div className="flex gap-1.5 items-center text-sm p-3 rounded-2xl rounded-bl-none bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-500">
                    <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0,-3,0]}} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
                    <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0,-3,0]}} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                    <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0,-3,0]}} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                </div>
            </div>
        )
    }
    
    const renderContent = () => {
        switch (type) {
            case 'status_card': return <StatusCard status={content} />;
            case 'connection_card': return <ConnectionCard link={content.subscription_url} />;
            case 'ping_card': return <PingCard payload={content} />;
            case 'reward_card': return <RewardCard payload={content} />;
            case 'server_list_card': return <ServerListCard payload={content} onSwitchServer={onSwitchServer} />;
            default:
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                const boldRegex = /\*\*([^\*]+)\*\*/g;
                const interimText = content.replace(linkRegex, `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 font-bold hover:underline">$1</a>`);
                const finalText = interimText.replace(boldRegex, '<strong class="font-extrabold">$1</strong>');
                return <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: finalText }}></p>
        }
    };

    return (
        <div className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                 <div className="w-10 h-10 flex-shrink-0 self-start">
                    <PanbehCharacterAnimated size={40} float={false} />
                </div>
            )}
            <div className={`prose max-w-[80%] p-3 rounded-2xl shadow-sm ${isUser ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200/50'}`}>
                {renderContent()}
            </div>
        </div>
    );
}

// --- Main Chat Component ---
interface DashboardAiChatProps {
    userName: string;
    onNavigate: (view: DashboardView) => void;
    isStandalone?: boolean;
    onClose?: () => void;
}

export const DashboardAiChat: React.FC<DashboardAiChatProps> = ({ userName, onNavigate, isStandalone = false, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Effect for initializing the chat instance
    useEffect(() => {
        if (!ai) return;

        setMessages([]); // Clear messages when user context changes
        const isLoggedIn = !!userName;
        const { tools, instruction } = isLoggedIn 
            ? { tools: loggedInTools, instruction: loggedInSystemInstruction }
            : { tools: guestTools, instruction: guestSystemInstruction };

        const panbehChat = ai.chats.create({
            model,
            config: {
                systemInstruction: instruction,
                tools,
            }
        });
        setChat(panbehChat);

    }, [userName]);

    // Effect for sending the proactive greeting AFTER chat is initialized
    useEffect(() => {
        if (chat) { // Only run if chat instance exists
            if (userName) {
                // Send a silent, hidden message to trigger the proactive greeting
                sendMessageToAI("GENERATE_PROACTIVE_GREETING", true);
            } else {
                 // Initial message for guests
                 addMessage('text', "سلام! من پنبه هستم، دستیار هوشمند شما در دنیای اینترنت آزاد. ☁️ خوشحالم که اینجا هستی. هر سوالی در مورد سرویس‌های ما، قیمت‌ها، یا حتی خود VPN داری، با خیال راحت بپرس!", false);
            }
        }
    }, [chat]); // This effect depends on `chat`


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);
    
    const addMessage = (type: MessageType, content: any, isUser: boolean) => {
        const newMessage: Message = { id: Date.now() + Math.random(), type, content, isUser };
        setMessages(prev => [...prev, newMessage]);
    };

    const sendMessageToAI = async (messageText: string, isSilent: boolean = false) => {
        if (!messageText.trim() || !chat) return;

        if (!isSilent) {
          addMessage('text', messageText, true);
        }
        setInputValue('');
        setIsTyping(true);

        try {
            const finalMessage = userName ? `(My username is ${userName}) ${messageText}` : messageText;
            let response = await chat.sendMessage({ message: finalMessage });
            
            while(response.functionCalls && response.functionCalls.length > 0) {
                const functionResponseParts: Part[] = [];
                for(const functionCall of response.functionCalls) {
                    const { name, args } = functionCall;
                    let apiResult;
                    
                    console.log(`AI is calling tool: ${name} with args:`, args);
                    
                    const toolHandlers = {
                      'get_user_status': () => marzbanApi.getUserStatus(args.userName as string),
                      'get_connection_link': () => marzbanApi.getConnectionLink(args.userName as string),
                      'create_subscription': () => marzbanApi.createSubscription(args.userName as string, args.plan as string),
                      'reset_user_traffic': () => marzbanApi.resetUserTraffic(args.userName as string),
                      'get_status_from_link': () => marzbanApi.getStatusFromLink(args.link as string),
                      'check_domain_ping_from_iran': () => marzbanApi.pingDomainFromIran(args.domain as string),
                      'revoke_and_renew_link': () => marzbanApi.revokeAndRenewLink(args.userName as string),
                      'get_server_health': () => marzbanApi.getServerHealth(args.serverId as string),
                      'get_available_servers': () => marzbanApi.getAvailableServers(),
                      'switch_user_server': () => marzbanApi.switchUserServer(args.userName as string, args.serverId as string),
                      'grant_reward': () => marzbanApi.grantReward(args.userName as string, args.reason as string),
                      'get_system_announcements': () => marzbanApi.getSystemAnnouncements(),
                      'log_unresolved_issue': () => marzbanApi.logUnresolvedIssue(args.userName as string, args.issueSummary as string),
                      'get_client_download_links': () => marzbanApi.getClientDownloadLinks(),
                    };

                    apiResult = toolHandlers[name] ? await toolHandlers[name]() : { error: 'Unknown function' };

                    if (apiResult?.error) {
                        addMessage('text', apiResult.summary || `متاسفانه خطایی در اجرای ابزار ${name} رخ داد.`, false);
                        setIsTyping(false);
                        return; // Stop processing on error
                    }

                    if (apiResult?.type) {
                        if (apiResult.type === 'server_list_card') {
                             addMessage(apiResult.type, apiResult.payload, false);
                        } else {
                             addMessage(apiResult.type, apiResult.payload, false);
                        }
                    }

                    functionResponseParts.push({ functionResponse: { name, response: apiResult } });
                }
                
                response = await chat.sendMessage({ message: functionResponseParts });
            }

            const finalResponseText = response.text?.trim();
            if (finalResponseText) {
                 addMessage('text', finalResponseText, false);
            }

        } catch (error) {
            console.error("Error calling Gemini API or Marzban API:", error);
            const errorMessage = (error as any)?.message || "یک خطای ناشناخته رخ داد."
            addMessage('text', `اوه! مثل اینکه یکم خسته شدم یا یه مشکلی پیش اومده. میشه چند لحظه دیگه دوباره امتحان کنی؟ 😔 (خطا: ${errorMessage})`, false);
        } finally {
            setIsTyping(false);
        }
    };
    
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessageToAI(inputValue);
    };
    
    const handleSuggestionClick = (prompt: string) => {
        sendMessageToAI(prompt);
    };

    const handleSwitchServer = (serverId: string) => {
        sendMessageToAI(`لطفا من را به سرور ${serverId} منتقل کن.`);
    };

    const suggestions = userName ? [
        { text: "وضعیت اشتراکم چطوره؟", icon: <ShieldCheck size={16}/>, prompt: `وضعیت اشتراک من رو چک کن` },
        { text: "تغییر سرور", icon: <Server size={16}/>, prompt: `میخوام سرورم رو عوض کنم` },
        { text: "لینک دانلود برنامه", icon: <Download size={16}/>, prompt: `لینک دانلود برنامه اندروید رو بده` },
        { text: "نمیتونم وصل بشم!", icon: <WifiOff size={16}/>, prompt: `نمیتونم به سرویس وصل بشم` },
    ] : [
        { text: "VPN چیست؟", icon: <ShieldCheck size={16}/>, prompt: `VPN چیست و چرا به آن نیاز دارم؟` },
        { text: "کدام پلن برای من بهتر است؟", icon: <ShoppingBag size={16}/>, prompt: `کدام پلن برای من مناسب‌تر است؟ من بیشتر فیلم و سریال تماشا می‌کنم.` },
        { text: "لینک دانلود اندروید", icon: <Download size={16}/>, prompt: `برنامه اندروید را از کجا می‌توانم دانلود کنم؟` },
    ];
    
    if (!ai) {
        return (
             <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-red-50 rounded-3xl">
                <PanbehCharacterAnimated size={120} expression="wow"/>
                <h2 className="text-xl font-bold text-red-700 mt-4">خطا در اتصال به سرویس هوش مصنوعی</h2>
                <p className="text-red-600 mt-2">کلید API برای Gemini پیدا نشد.</p>
                <p className="text-sm text-gray-500 mt-4">لطفاً از تنظیم صحیح متغیرهای محیطی اطمینان حاصل کنید.</p>
             </div>
        );
    }
    
    if (!chat) {
         return (
             <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-purple-50 rounded-3xl">
                <PanbehCharacterAnimated size={120} float={true} expression="thinking"/>
                <p className="text-purple-700 font-bold text-lg mt-4 flex items-center gap-2">
                    <LoaderCircle size={20} className="animate-spin" />
                    پنبه در حال آماده شدن...
                </p>
             </div>
        );
    }

    return (
        <div className={`w-full h-full ${isStandalone ? 'lg:bg-gradient-to-b from-amber-50 to-[#FEF7E1] lg:p-6' : ''}`}>
            {/* Desktop View */}
            <div className="hidden lg:flex flex-col h-full">
                 <div className="relative text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">دستیار هوشمند پنبه</h1>
                    <p className="text-gray-600">آماده برای حل مشکلات و پاسخ به سوالات شما!</p>
                     {isStandalone && (
                        <button
                            onClick={() => onClose?.()}
                            className="absolute -top-2 -left-2 p-2 bg-white/60 rounded-full shadow-md text-gray-600 hover:bg-rose-100 hover:text-rose-600 transition-all hover:rotate-90"
                            aria-label="Close chat"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>
                <div className="flex-grow flex items-stretch justify-center gap-8 bg-white/50 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-md overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-1/3 flex flex-col items-center"
                    >
                        <div className="relative w-40 h-40 mb-6">
                            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-70"></div>
                            <PanbehCharacterAnimated size={160} expression={isTyping ? 'writing' : 'excited'} float={true} />
                        </div>
                        <h3 className="font-bold text-gray-700 mb-4 text-center">پیشنهادهای سریع:</h3>
                        <div className="w-full space-y-3">
                             {suggestions.map((s, i) => (
                                <SuggestionButton key={s.text} text={s.text} icon={s.icon} onClick={() => handleSuggestionClick(s.prompt)} delay={i * 0.1}/>
                             ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-2/3 h-full flex flex-col bg-white/70 rounded-2xl shadow-inner border border-white/70"
                    >
                       <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                            <AnimatePresence>
                                {messages.map(msg => (
                                    <motion.div key={msg.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <MessageRenderer msg={msg} onSwitchServer={handleSwitchServer}/>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isTyping && (
                                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <MessageRenderer msg={{ id: 0, type: 'typing', isUser: false, content: ''}} onSwitchServer={handleSwitchServer}/>
                                </motion.div>
                            )}
                       </div>
                       <div className="p-4 border-t border-gray-200/80">
                           <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    placeholder="پیام خود را بنویسید..."
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    disabled={isTyping}
                                    className="w-full bg-white/80 border-2 border-gray-200 rounded-full px-4 py-3 pl-12 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-60"
                                />
                                <Button type="submit" disabled={isTyping || !inputValue.trim()} size="icon" className="absolute top-1/2 left-2 transform -translate-y-1/2 w-9 h-9 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed">
                                    <Send size={18} />
                                </Button>
                            </form>
                       </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden flex flex-col h-full w-full bg-gradient-to-b from-amber-50 to-[#FEF7E1]">
                 <header className="flex-shrink-0 bg-white/60 backdrop-blur-lg p-3 flex items-center justify-between shadow-sm z-10">
                    <button onClick={isStandalone ? () => onClose?.() : () => onNavigate('overview')} className="p-2 text-gray-600 hover:bg-gray-200/50 rounded-full">
                        {isStandalone ? <X size={22} /> : <ArrowLeft size={22} />}
                    </button>
                    <div className="flex items-center gap-3">
                         <div>
                            <h1 className="font-extrabold text-gray-800 text-right">دستیار هوشمند پنبه</h1>
                            <p className="text-xs font-bold text-green-600 text-right">● آنلاین</p>
                         </div>
                         <div className="w-12 h-12">
                            <PanbehCharacterAnimated size={48} float={false} />
                        </div>
                    </div>
                </header>
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.length === 0 && !isTyping && (
                         <div className="h-full flex flex-col justify-end items-center pb-4">
                            <div className="w-full space-y-2">
                               {suggestions.map((s, i) => (
                                   <motion.button
                                        key={s.text}
                                        onClick={() => handleSuggestionClick(s.prompt)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.1 }}
                                        className="w-full text-sm flex items-center gap-2 p-3 bg-white/60 backdrop-blur-md rounded-xl shadow-sm border border-white/50"
                                   >
                                       {s.icon} {s.text}
                                   </motion.button>
                               ))}
                            </div>
                        </div>
                    )}
                    <AnimatePresence>
                        {messages.map(msg => (
                            <motion.div key={msg.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <MessageRenderer msg={msg} onSwitchServer={handleSwitchServer}/>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <MessageRenderer msg={{ id: 0, type: 'typing', isUser: false, content: ''}} onSwitchServer={handleSwitchServer}/>
                        </motion.div>
                    )}
                </div>
                <div className="flex-shrink-0 p-3 border-t border-gray-200/50 bg-white/40 backdrop-blur-sm">
                   <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            placeholder="پیام خود را بنویسید..."
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            disabled={isTyping}
                            className="w-full bg-white/80 border-2 border-gray-200 rounded-full px-4 py-3 pl-12 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-60"
                        />
                        <Button type="submit" disabled={isTyping || !inputValue.trim()} size="icon" className="absolute top-1/2 left-2 transform -translate-y-1/2 w-9 h-9 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed">
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
