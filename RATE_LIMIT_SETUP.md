# Rate Limiting Setup Guide

## 🛡️ How It Works

Your production API now has **rate limiting**:
- **Public**: 2 requests per minute per IP
- **You (Admin)**: Unlimited access with special header

## 🔧 Setup Steps

### Step 1: Create KV Namespace

Run these commands to create the KV storage for rate limiting:

```bash
# Create production KV namespace
wrangler kv:namespace create "RATE_LIMIT"

# Create preview KV namespace (for testing)
wrangler kv:namespace create "RATE_LIMIT" --preview
```

You'll get output like:
```
🌀 Creating namespace with title "persona-agent-RATE_LIMIT"
✨  Success!
Add the following to your wrangler.toml:
{ binding = "RATE_LIMIT", id = "abc123..." }
```

### Step 2: Update wrangler.toml

Replace `YOUR_KV_ID_HERE` and `YOUR_PREVIEW_KV_ID` in `wrangler.toml` with the IDs from Step 1.

Example:
```toml
[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "abc123def456..."  # Your production ID
preview_id = "xyz789..."  # Your preview ID
```

### Step 3: Set Your Admin Key (Secret)

**IMPORTANT**: Do NOT put this in wrangler.toml (it would be visible in Git/OSF.io)

Use wrangler secret instead:

```bash
# Set your admin key as an encrypted secret
wrangler secret put ADMIN_KEY
```

It will prompt you to enter the secret:
```
Enter a secret value: ****your-secret-key****
✨  Success! Uploaded secret ADMIN_KEY
```

**This keeps your key encrypted in Cloudflare** - not visible in your code!

### Step 4: Deploy

```bash
npm run deploy
```

---

## 🎯 How to Use Unlimited Access (For You)

### Using chat.sh

Add your admin key as environment variable:

```bash
# Export your admin key
export ADMIN_KEY="my-super-secret-key-dont-share-this"

# Use unlimited chat
./chat.sh "Any question"
```

Update `chat.sh` to use admin key:
```bash
# Add this line after URL is set
HEADERS=""
if [ -n "$ADMIN_KEY" ]; then
    HEADERS="-H 'X-Admin-Key: $ADMIN_KEY'"
fi

# Use in curl
curl $HEADERS -X POST "$URL" ...
```

### Using curl directly

Add the header:

```bash
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "X-Admin-Key: my-super-secret-key-dont-share-this" \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Test"}'
```

### Using scripts/automation

Any automated tool just needs to add the header:
```bash
-H "X-Admin-Key: your-secret-key"
```

---

## 📊 Rate Limit Behavior

### Public Users (No Admin Key)
- **Limit**: 2 requests per 60 seconds
- **Response**: 429 error on 3rd request:
  ```json
  {
    "type": "error",
    "error": "Rate limit exceeded",
    "message": "Limit: 2 requests per minute. Please wait..."
  }
  ```

### You (With Admin Key)
- **Limit**: Unlimited ✅
- **How**: Add header `X-Admin-Key: your-secret`
- **No 429 errors**

---

## 🔐 Security Best Practices

1. **NEVER Put Admin Key in wrangler.toml or .env**
   - ❌ Don't commit secrets to Git
   - ❌ Don't put in wrangler.toml (visible in GitHub/OSF.io)
   - ✅ Use `wrangler secret put ADMIN_KEY` instead

2. **Use Wrangler Secrets** (Encrypted):
   ```bash
   wrangler secret put ADMIN_KEY
   # Enter your secret when prompted
   # It's encrypted and stored only in Cloudflare
   ```

3. **For Local Development**:
   - Create `.dev.vars` file (add to .gitignore):
     ```
     ADMIN_KEY=your-local-dev-key
     ```
   - This file is NOT committed to Git
   - Only used for `wrangler dev`

4. **Change Key if Leaked**:
   ```bash
   wrangler secret put ADMIN_KEY
   # Enter new secret
   ```

---

## 🧪 Testing

### Test Rate Limiting (Public)
```bash
# Request 1 - OK
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Test 1"}'

# Request 2 - OK
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Test 2"}'

# Request 3 - BLOCKED (429 error)
curl -X POST https://persona-agent.tarroto.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"mode":"chat","message":"Test 3"}'
```

### Test Unlimited (Admin)
```bash
# All requests work with admin key
for i in {1..10}; do
  curl -X POST https://persona-agent.tarroto.workers.dev \
    -H "X-Admin-Key: your-secret-key" \
    -H "Content-Type: application/json" \
    -d "{\"mode\":\"chat\",\"message\":\"Test $i\"}"
done
```

---

## 🎯 Summary

✅ Public: 2 requests/min (prevents abuse)  
✅ You: Unlimited (with admin key header)  
✅ Free tier protected  
✅ Research still accessible

Your API is now protected while staying usable! 🛡️
