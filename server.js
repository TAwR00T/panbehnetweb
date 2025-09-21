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
    // A comprehensive Content-Security-Policy to prevent XSS attacks.
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' aistudiocdn.com; " +
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com aistudiocdn.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: https://images.unsplash.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' /api/marzban/* https://fonts.googleapis.com https://fonts.gstatic.com; " +
        "frame-src 'self' https://www.youtube.com; " +
        "object-src 'none'; " +
        "base-uri 'self';"
    );
    // Enforce HTTPS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // Prevent Clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // Prevent MIME-sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Control referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Isolate cross-origin popups
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});


app.use(cors());
app.use(express.json());

const { MARZBAN_API_BASE_URL, MARZBAN_ADMIN_USERNAME, MARZBAN_ADMIN_PASSWORD } = process.env;

if (!MARZBAN_API_BASE_URL || !MARZBAN_ADMIN_USERNAME || !MARZBAN_ADMIN_PASSWORD) {
  console.error("FATAL ERROR: Marzban environment variables are not set.");
  process.exit(1);
}

let accessToken = null;
let tokenExpiry = 0;

// Function to get a fresh access token from Marzban
async function getMarzbanToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

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
    // Set expiry to 5 minutes before the actual token expires, just to be safe
    // Marzban default expiry is 1 hour (3600s)
    tokenExpiry = Date.now() + (3600 - 300) * 1000; 
    console.log("Successfully obtained new Marzban access token.");
    return accessToken;
  } catch (error) {
    console.error("Error getting Marzban token:", error);
    accessToken = null; // Invalidate token on failure
    throw error;
  }
}

// Middleware to ensure we have a valid token for all Marzban requests
const marzbanAuthMiddleware = async (req, res, next) => {
  try {
    const token = await getMarzbanToken();
    req.marzbanToken = token;
    next();
  } catch (error) {
    res.status(503).json({ detail: 'Could not authenticate with the Marzban service.', summary: 'سرویس پنل در حال حاضر در دسترس نیست. لطفاً بعدا تلاش کنید.' });
  }
};

// Generic proxy function
const proxyRequest = async (req, res, path, method, body = null) => {
  try {
    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${req.marzbanToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${MARZBAN_API_BASE_URL}${path}`, options);
    
    let data;
    try {
        data = await response.json();
    } catch(e) {
        // Handle cases where Marzban returns non-JSON or empty body with error status
        data = { detail: response.statusText, summary: `An error occurred with status: ${response.status}` };
    }

    if (!response.ok) {
        // If error detail is an array, format it.
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

// Get User Status
router.get('/user/:username', (req, res) => {
  proxyRequest(req, res, `/api/user/${req.params.username}`, 'GET');
});

// Get Status from Link
router.get('/sub-info/:token', (req, res) => {
    proxyRequest(req, res, `/sub/${req.params.token}/info`, 'GET');
});

// Create User
router.post('/user', (req, res) => {
  proxyRequest(req, res, '/api/user', 'POST', req.body);
});

// Modify User (for plan renewal)
router.put('/user/:username', (req, res) => {
  proxyRequest(req, res, `/api/user/${req.params.username}`, 'PUT', req.body);
});

// Reset User Traffic
router.post('/user/:username/reset', (req, res) => {
  proxyRequest(req, res, `/api/user/${req.params.username}/reset`, 'POST');
});

// Revoke User Subscription
router.post('/user/:username/revoke_sub', (req, res) => {
  proxyRequest(req, res, `/api/user/${req.params.username}/revoke_sub`, 'POST');
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Static File Serving for Production ---
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler for client-side routing
app.get('*', (req, res) => {
    // If the request is not for an API endpoint, serve the main HTML file.
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        // Let API 404s fall through to Express's default handler
        next();
    }
});


app.listen(port, () => {
  console.log(`Panbeh VPN Backend Server listening on port ${port}`);
});