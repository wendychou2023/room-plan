import { createProxyMiddleware } from 'http-proxy-middleware';

// Proxy configuration
const targetUrl = 'https://marvin.uni-marburg.de/qisserver/pages/cm/exa/timetable/roomScheduleCalendarExport.faces';
export default function handler(req, res) {
    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            '^/api/proxy': '',
        },
        onProxyReq(proxyReq, req, res) {
            console.log('Proxying request to:', targetUrl);
        },
    });

    return proxy(req, res);
}
