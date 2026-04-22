const API_BASE = 'https://demo.taokeyun.cn/api';

const Api = {
    _token: null,
    _user: null,

    get token() {
        if (!this._token) this._token = localStorage.getItem('token') || '';
        return this._token;
    },

    set token(v) {
        this._token = v;
        if (v) localStorage.setItem('token', v); else localStorage.removeItem('token');
    },

    get user() {
        if (!this._user) {
            try { this._user = JSON.parse(localStorage.getItem('user') || 'null'); } catch(e) { this._user = null; }
        }
        return this._user;
    },

    set user(v) {
        this._user = v;
        if (v) localStorage.setItem('user', JSON.stringify(v)); else localStorage.removeItem('user');
    },

    get isLoggedIn() { return !!this.token; },

    async request(path, options = {}) {
        const headers = { ...options.headers };
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

        const fullUrl = API_BASE + path;
        console.log('API请求URL:', fullUrl);
        console.log('API请求选项:', options);
        console.log('请求头:', headers);
        
        try {
            const res = await fetch(fullUrl, {
                ...options,
                headers
            });
            
            console.log('API响应状态:', res.status);
            console.log('API响应URL:', res.url);
            
            let data;
            try {
                data = await res.json();
            } catch (jsonError) {
                console.error('JSON解析失败:', jsonError);
                data = { code: res.status, message: '响应格式错误' };
            }
            
            if (!res.ok) {
                console.error('API响应错误:', data);
                return data;
            }
            
            console.log('API响应数据:', data);

            if (data.code === 401) {
                this.logout();
                return data;
            }

            return data;
        } catch (error) {
            console.error('API请求失败:', error);
            console.error('错误堆栈:', error.stack);
            throw error;
        }
    },

    async sendCode(email, type) {
        return this.request('/auth/send-code', {
            method: 'POST',
            body: JSON.stringify({ email, type })
        });
    },

    async register(email, code, password, nickname) {
        const res = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, code, password, nickname })
        });
        if (res.code === 200) {
            this.token = res.data.token;
            this.user = res.data.user;
        }
        return res;
    },

    async login(email, code, password) {
        const body = { email };
        if (code) body.code = code;
        if (password) body.password = password;

        const res = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        if (res.code === 200) {
            this.token = res.data.token;
            this.user = res.data.user;
        }
        return res;
    },

    async getProfile() {
        const res = await this.request('/auth/profile');
        if (res.code === 200) this.user = res.data;
        return res;
    },

    async updateProfile(data) {
        return this.request('/auth/profile', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    logout() {
        this.token = null;
        this.user = null;
        window.location.href = '/index.html';
    },

    async listSessions(page = 1, pageSize = 50) {
        return this.request(`/chat/sessions?page=${page}&page_size=${pageSize}`);
    },

    async createSession(employeeId, employeeName, collaborationMode, selectedEmployees) {
        return this.request('/chat/session/create', {
            method: 'POST',
            body: JSON.stringify({
                employee_id: employeeId || '',
                employee_name: employeeName || '',
                collaboration_mode: !!collaborationMode,
                selected_employees: selectedEmployees || []
            })
        });
    },

    async getSessionMessages(sessionId) {
        return this.request(`/chat/messages?session_id=${sessionId}`);
    },

    async sendMessage(sessionId, content, model) {
        return this.request('/chat/send', {
            method: 'POST',
            body: JSON.stringify({ session_id: sessionId, content, model })
        });
    },

    // 流式发送消息（SSE）
    async streamSendMessage(sessionId, content, model, onToken, onDone, onError) {
        const response = await fetch(API_BASE + '/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ session_id: sessionId, content, model })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.error && onError) {
                            onError(data.error);
                            return;
                        }
                        if (data.token && onToken) {
                            onToken(data.token);
                        }
                        if (data.done && onDone) {
                            onDone(data);  // 传递完整数据（包含follow_ups）
                            return;
                        }
                    } catch (e) {
                        console.error('Parse error:', e);
                    }
                }
            }
        }
    },

    async deleteSession(sessionId) {
        return this.request('/chat/session/delete', {
            method: 'POST',
            body: JSON.stringify({ session_id: sessionId })
        });
    },

    async saveApiKey(provider, apiKey) {
        return this.request(`/user/api-key/${provider}`, {
            method: 'POST',
            body: JSON.stringify({ api_key: apiKey })
        });
    }
};
