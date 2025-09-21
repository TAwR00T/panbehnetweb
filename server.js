import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;

// --- Security Headers Middleware ---
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' aistudiocdn.com; " +
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com aistudiocdn.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: https://images.unsplash.com https://secure.gravatar.com; " + // Added gravatar for WP authors
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' /api/* https://fonts.googleapis.com https://fonts.gstatic.com; " +
        "frame-src 'self' https://www.youtube.com; " +
        "object-src 'none'; " +
        "base-uri 'self';"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Static File Serving with Advanced Caching ---
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y', // Cache assets for 1 year
    etag: true,   // Use ETag for validation
}));

app.use(cors());
app.use(express.json());

const { MARZBAN_API_BASE_URL, MARZBAN_ADMIN_USERNAME, MARZBAN_ADMIN_PASSWORD, WORDPRESS_API_URL } = process.env;
let isApiProxyEnabled = true;

if (!MARZBAN_API_BASE_URL || !MARZBAN_ADMIN_USERNAME || !MARZBAN_ADMIN_PASSWORD) {
  console.warn("WARNING: Marzban environment variables are not fully set. API proxy will be disabled.");
  isApiProxyEnabled = false;
}

// --- WordPress API Proxy ---
if (WORDPRESS_API_URL) {
    app.use('/api/wp', async (req, res) => {
        try {
            const apiUrl = `${WORDPRESS_API_URL}/wp-json${req.url}`;
            const response = await fetch(apiUrl, {
                method: req.method,
                headers: { 'Content-Type': 'application/json' },
                body: req.method !== 'GET' ? JSON.stringify(req.body) : null,
            });
            const data = await response.json();
            if (!response.ok) {
                return res.status(response.status).json(data);
            }
            res.status(200).json(data);
        } catch (error) {
            console.error('Error proxying to WordPress:', error);
            res.status(502).json({ detail: 'Could not connect to the content service.' });
        }
    });
} else {
    console.warn("WARNING: WORDPRESS_API_URL is not set. Content API proxy is disabled.");
}

let accessToken = null;
let tokenExpiry = 0;

async function getMarzbanToken() {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;
  console.log("Getting new Marzban access token...");
  try {
    const params = new URLSearchParams();
    params.append('username', MARZBAN_ADMIN_USERNAME);
    params.append('password', MARZBAN_ADMIN_PASSWORD);
    const response = await fetch(`${MARZBAN_API_BASE_URL}/api/admin/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Marzban authentication failed: ${errorData.detail || response.statusText}`);
    }
    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (3600 - 300) * 1000;
    console.log("Successfully obtained new Marzban access token.");
    return accessToken;
  } catch (error) {
    console.error("Error getting Marzban token:", error);
    accessToken = null;
    throw error;
  }
}

const marzbanAuthMiddleware = async (req, res, next) => {
  if (!isApiProxyEnabled) {
    return res.status(503).json({ detail: 'API proxy is not configured on the server.', summary: 'سرویس چت هوشمند در حال حاضر در دسترس نیست.' });
  }
  try {
    req.marzbanToken = await getMarzbanToken();
    next();
  } catch (error) {
    res.status(503).json({ detail: 'Could not authenticate with the Marzban service.', summary: 'سرویس پنل در حال حاضر در دسترس نیست. لطفاً بعدا تلاش کنید.' });
  }
};

const proxyRequest = async (req, res, path, method, body = null) => {
  try {
    const options = {
      method: method,
      headers: { 'Authorization': `Bearer ${req.marzbanToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`${MARZBAN_API_BASE_URL}${path}`, options);
    let data;
    try { data = await response.json(); }
    catch(e) { data = { detail: response.statusText, summary: `An error occurred with status: ${response.status}` }; }
    if (!response.ok) {
        if (Array.isArray(data.detail)) {
            data.detail = data.detail.map(err => `${err.msg} (in ${err.loc.join(' > ')})`).join(', ');
        }
        return res.status(response.status).json(data);
    }
    return res.status(response.status).json(data);
  } catch (error) {
    console.error(`Error proxying request to ${path}:`, error);
    res.status(500).json({ detail: 'An internal server error occurred.', summary: 'یک خطای داخلی در سرور رخ داد.' });
  }
};

// --- API Routes ---
const router = express.Router();
app.use('/api/marzban', marzbanAuthMiddleware, router);

router.get('/user/:username', (req, res) => proxyRequest(req, res, `/api/user/${req.params.username}`, 'GET'));
router.get('/sub-info/:token', (req, res) => proxyRequest(req, res, `/sub/${req.params.token}/info`, 'GET'));
router.post('/user', (req, res) => proxyRequest(req, res, '/api/user', 'POST', req.body));
router.put('/user/:username', (req, res) => proxyRequest(req, res, `/api/user/${req.params.username}`, 'PUT', req.body));
router.post('/user/:username/reset', (req, res) => proxyRequest(req, res, `/api/user/${req.params.username}/reset`, 'POST'));
router.post('/user/:username/revoke_sub', (req, res) => proxyRequest(req, res, `/api/user/${req.params.username}/revoke_sub`, 'POST'));

// --- Sitemap Route ---
app.get('/sitemap.xml', async (req, res) => {
    const baseUrl = 'https://www.panbeh.vpn'; // TODO: Replace with actual domain from env var
    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    xml += `<url><loc>${baseUrl}/</loc><priority>1.00</priority></url>`;
    xml += `<url><loc>${baseUrl}/blog</loc><priority>0.80</priority></url>`;
    if (WORDPRESS_API_URL) {
        try {
            const postsResponse = await fetch(`${WORDPRESS_API_URL}/wp-json/wp/v2/posts?_fields=slug,modified`);
            if (postsResponse.ok) {
                const posts = await postsResponse.json();
                posts.forEach(post => {
                    xml += `<url><loc>${baseUrl}/blog/${post.slug}</loc>`;
                    xml += `<lastmod>${new Date(post.modified).toISOString().split('T')[0]}</lastmod>`;
                    xml += `<priority>0.64</priority></url>`;
                });
            }
        } catch (error) { console.error("Could not fetch posts for sitemap:", error); }
    }
    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

// --- Catchall Handler for Client-Side Routing ---
app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        next();
    }
});

app.listen(port, () => {
  console.log(`Panbeh VPN Backend Server listening on port ${port}`);
});