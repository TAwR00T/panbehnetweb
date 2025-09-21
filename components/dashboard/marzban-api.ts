// This file now communicates with your own secure backend server,
// which then proxies requests to the Marzban panel.
// This is the correct and secure architecture.

// --- Helper Functions ---
const bytesToGB = (bytes: number): number => bytes > 0 ? bytes / (1024 ** 3) : 0;

/**
 * A wrapper for making API requests to our own backend.
 * @param endpoint The API endpoint (e.g., '/api/marzban/user/test')
 * @param options The fetch options
 */
const fetchFromBackend = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(endpoint, options);
  const data = await response.json();
  if (!response.ok) {
    // The backend now formats the error, so we can just throw it.
    throw data;
  }
  return data;
};


// Note: No initialize function is needed here anymore. The backend handles authentication.

export const getUserStatus = async (userName: string) => {
    try {
        const user = await fetchFromBackend(`/api/marzban/user/${userName}`);
        const now = Date.now() / 1000;
        const daysLeft = user.expire > 0 ? Math.max(0, Math.floor((user.expire - now) / (60 * 60 * 24))) : Infinity;
        const hostname = user.subscription_url ? new URL(user.subscription_url).hostname : 'N/A';
        
        // Mock data can still be used for frontend-specific features if needed,
        // but core data comes from the API.
        const mockData = {
            lifetime_used_traffic: Math.random() * 100 * (1024**3),
            current_server_id: 'de-1',
            reward_granted_50gb: false,
        };

        const statusData = {
            status: user.status,
            used_traffic_gb: bytesToGB(user.used_traffic),
            data_limit_gb: bytesToGB(user.data_limit),
            days_left: daysLeft,
            hostname: hostname,
            lifetime_used_traffic_gb: bytesToGB(mockData.lifetime_used_traffic),
            current_server_id: mockData.current_server_id,
            reward_granted_50gb: mockData.reward_granted_50gb
        };

        return {
            type: "status_card",
            payload: statusData,
            summary: `User ${userName} status checked.`
        };
    } catch (error) {
        return { error: error.detail, summary: error.detail || 'متاسفانه نتونستم اطلاعات این کاربر رو پیدا کنم. 😔' };
    }
};

export const getStatusFromLink = async (link: string) => {
    try {
        const url = new URL(link);
        const parts = url.pathname.split('/');
        const token = parts[parts.indexOf('sub') + 1];
        if (!token) throw new Error('Invalid subscription link format');

        const user = await fetchFromBackend(`/api/marzban/sub-info/${token}`);
        const now = Date.now() / 1000;
        const daysLeft = user.expire > 0 ? Math.max(0, Math.floor((user.expire - now) / (60 * 60 * 24))) : Infinity;
        const hostname = url.hostname;

        const statusData = {
            status: user.status,
            used_traffic_gb: bytesToGB(user.used_traffic),
            data_limit_gb: bytesToGB(user.data_limit),
            days_left: daysLeft,
            hostname: hostname
        };

        return {
            type: "status_card",
            payload: statusData,
            summary: `User with link has used ${statusData.used_traffic_gb.toFixed(2)}GB.`
        };
    } catch (error) {
        return { error: error.detail, summary: error.detail || 'متاسفانه این لینک اشتراک رو پیدا نکردم. مطمئنی که لینک درسته؟ 🤔' };
    }
};

export const getConnectionLink = async (userName: string) => {
    try {
        const user = await fetchFromBackend(`/api/marzban/user/${userName}`);
        return {
            type: "connection_card",
            payload: { subscription_url: user.subscription_url },
            summary: `Connection link for ${userName} is ready.`
        };
    } catch (error) {
        return { error: error.detail, summary: error.detail || 'متاسفانه نتونستم لینک این کاربر رو پیدا کنم. 😔' };
    }
};

export const createSubscription = async (userName: string, plan: string) => {
    try {
        let existingUser = null;
        try {
            existingUser = await fetchFromBackend(`/api/marzban/user/${userName}`);
        } catch (e) { /* User does not exist, which is fine */ }
        
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
        const gbToBytes = (gb: number): number => gb * (1024 ** 3);
        const dataLimitInBytes = plan === 'Pro' ? gbToBytes(50) : gbToBytes(100);

        if (existingUser) {
            const currentExpiry = existingUser.expire > nowInSeconds ? existingUser.expire : nowInSeconds;
            await fetchFromBackend(`/api/marzban/user/${userName}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                     data_limit: dataLimitInBytes,
                     expire: currentExpiry + thirtyDaysInSeconds,
                     status: 'active'
                }),
            });
        } else {
             await fetchFromBackend('/api/marzban/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: userName,
                    data_limit: dataLimitInBytes,
                    expire: nowInSeconds + thirtyDaysInSeconds,
                }),
            });
        }
        return { success: true, summary: `پلن '${plan}' با موفقیت برای شما فعال شد.` };
    } catch (error) {
        const errorMessage = error.detail || 'An unexpected error occurred.';
        return { error: errorMessage, summary: `ای وای! نتونستم اشتراک رو برات بسازم. خطا: ${errorMessage}` };
    }
};

export const resetUserTraffic = async (userName: string) => {
    try {
        await fetchFromBackend(`/api/marzban/user/${userName}/reset`, { method: 'POST' });
        return { success: true, summary: `حجم مصرفی شما با موفقیت ریست شد.` };
    } catch (error) {
        return { error: error.detail, summary: error.detail || 'مشکلی در ریست کردن حجم پیش اومد.' };
    }
};

export const revokeAndRenewLink = async (userName: string) => {
    try {
        const user = await fetchFromBackend(`/api/marzban/user/${userName}/revoke_sub`, { method: 'POST' });
        return {
            type: "connection_card",
            payload: { subscription_url: user.subscription_url },
            summary: `لینک جدید برای کاربر ${userName} ساخته شد.`
        };
    } catch (error) {
        return { error: error.detail, summary: error.detail || 'مشکلی در ساخت لینک جدید پیش اومد.' };
    }
};

// --- Simulated Functions (can be moved to backend later) ---

export const pingDomainFromIran = async (domain: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isSuccess = !domain.includes('panbehpanel.ir'); 
    return {
        type: "ping_card",
        payload: { domain, success: isSuccess },
        summary: `Ping check for ${domain} was ${isSuccess ? 'successful' : 'unsuccessful'}.`
    };
};

export const getServerHealth = async (serverId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const health = {
        'de-1': { load: 'low', response_time: '25ms' },
        'us-1': { load: 'high', response_time: '120ms' },
        'tr-1': { load: 'medium', response_time: '45ms' },
        'jp-1': { load: 'low', response_time: '90ms' },
    };
    return {
        success: true,
        payload: health[serverId] || { load: 'unknown', response_time: 'n/a' },
        summary: `Health for server ${serverId} is ${health[serverId]?.load || 'unknown'}.`
    };
};

export const getAvailableServers = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const servers = [
        { id: 'de-1', name: 'Germany', location: '🇩🇪', health: 'Good' },
        { id: 'us-1', name: 'USA', location: '🇺🇸', health: 'High Load' },
        { id: 'tr-1', name: 'Turkey', location: '🇹🇷', health: 'Optimal' },
        { id: 'jp-1', name: 'Japan', location: '🇯🇵', health: 'Good' },
    ];
    return {
        type: 'server_list_card',
        payload: servers,
        summary: 'Returned a list of available servers.'
    };
};

export const switchUserServer = async (userName: string, serverId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
        success: true,
        summary: `با موفقیت به سرور جدید منتقل شدی! لطفاً یک بار اتصال خود را قطع و وصل کن و لیست سرورها را در برنامه‌ات آپدیت کن. ✨`
    };
};

export const grantReward = async (userName: string, reason: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const rewardData = {
        title: '🎉 قفل دستاورد باز شد! 🎉',
        description: `تبریک! به خاطر عبور از ۵۰ گیگابایت مصرف، شما دستاورد "کاربر حرفه‌ای" را باز کردید. به عنوان هدیه، ۲ گیگابایت ترافیک به حساب شما اضافه شد.`,
    };
    return {
        type: 'reward_card',
        payload: rewardData,
        summary: 'Reward granted for passing 50GB milestone.'
    };
};

export const getSystemAnnouncements = async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
        success: true,
        announcements: [
            "یک سرور جدید و پرسرعت در **ترکیه** اضافه کردیم که برای بازی و استریم عالیه!",
            "قابلیت تغییر سرور از طریق چت‌بات فعال شده است."
        ],
        summary: 'Fetched system announcements.'
    };
};

export const logUnresolvedIssue = async (userName: string, issueSummary: string) => {
    console.log(`[SUPPORT TICKET LOGGED for ${userName}]: ${issueSummary}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        success: true,
        summary: `ممنونم ازت! من مشکلت رو برای تیم پشتیبانی انسانی ثبت کردم. اون‌ها به زودی باهات تماس می‌گیرن و دیگه نیازی نیست چیزی رو دوباره برای اون‌ها توضیح بدی. ✨`
    };
};

export const getClientDownloadLinks = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    success: true,
    links: {
      android: {
        url: 'https://panbeh.vpn/android-latest.apk',
        client_name: 'V2RayNG'
      },
      windows: {
        url: 'https://panbeh.vpn/windows-latest.exe',
        client_name: 'NekoRay'
      },
      ios: {
        url: 'https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690',
        client_name: 'V2Box'
      }
    },
    summary: 'Fetched client download links.'
  };
};
