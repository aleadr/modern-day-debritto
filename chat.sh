#!/bin/bash

# Modern-Day De Britto - Interactive Chat
# Usage: ./chat.sh "Your question here"

# Colors for pretty output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Default to production, or use LOCAL=1 for local testing
if [ "$LOCAL" = "1" ]; then
    URL="http://localhost:8787"
    ENV="${GRAY}[LOCAL]${NC}"
else
    URL="https://persona-agent.tarroto.workers.dev"
    ENV="${GRAY}[PRODUCTION]${NC}"
fi

# Check if question is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  ./chat.sh \"Your question in Indonesian\" [admin-key]"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  ./chat.sh \"Siapa Anda?\""
    echo -e "  ./chat.sh \"Ceritakan tentang misi Anda\""
    echo -e "  LOCAL=1 ./chat.sh \"Test local server\""
    echo ""
    echo -e "${YELLOW}Unlimited Access (bypasses 20 req/min limit):${NC}"
    echo -e "  ./chat.sh \"Your question\" \"your-secret-admin-key\""
    exit 1
fi

QUESTION="$1"

# Admin key for unlimited access (optional)
# Pass as second parameter: ./chat.sh "question" "admin-key"
# Or set environment variable: export ADMIN_KEY="your-key"
# Leave blank for public rate-limited access
ADMIN_KEY="${2:-${ADMIN_KEY:-}}"

# Show request
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  ${BLUE}Modern-Day De Britto${NC} - AI Persona Chat $ENV"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}You:${NC} $QUESTION"
echo ""

# Build curl command with optional admin key header
if [ -n "$ADMIN_KEY" ]; then
    # Unlimited access with admin key
    RESPONSE=$(curl -s -X POST "$URL" \
      -H "X-Admin-Key: $ADMIN_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"mode\":\"chat\",\"message\":\"$QUESTION\"}")
else
    # Public rate-limited access
    RESPONSE=$(curl -s -X POST "$URL" \
      -H "Content-Type: application/json" \
      -d "{\"mode\":\"chat\",\"message\":\"$QUESTION\"}")
fi

# Check if request failed
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Error: Failed to connect to API${NC}"
    exit 1
fi

# Extract answer from JSON and handle \n properly
ANSWER=$(echo "$RESPONSE" | jq -r '.answer // .error // "No response"')

# Check if we got an error
if echo "$RESPONSE" | jq -e '.type == "error"' > /dev/null 2>&1; then
    echo -e "${YELLOW}St. John de Britto [Error]:${NC}"
    echo -e "$ANSWER" | sed 's/\\n/\n/g'
    exit 1
fi

# Display answer with proper formatting
echo -e "${YELLOW}St. John de Britto:${NC}"
echo -e "$ANSWER" | sed 's/\\n/\n/g' | fold -s -w 70
echo ""
echo -e "${GRAY}────────────────────────────────────────────────────────────────${NC}"
echo ""
