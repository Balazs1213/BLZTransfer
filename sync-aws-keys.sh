#!/bin/bash

# 1. Beolvassuk a kulcsokat a Windows-os helyedről
# A ~ jel a Git Bash-ben a felhasználói mappádat jelenti (C:/Users/User)
CRED_FILE="$HOME/.aws/credentials"

echo "🔍 Kulcsok keresése itt: $CRED_FILE"

if [ ! -f "$CRED_FILE" ]; then
    echo "❌ Hiba: Nem találom a .aws/credentials fájlt!"
    exit 1
fi

# Kiszedjük az értékeket (levágjuk az aws_...= részt és a szóközöket)
AK=$(grep aws_access_key_id "$CRED_FILE" | cut -d'=' -f2 | xargs)
SAK=$(grep aws_secret_access_key "$CRED_FILE" | cut -d'=' -f2 | xargs)
ST=$(grep aws_session_token "$CRED_FILE" | cut -d'=' -f2 | xargs)

# 2. Feltöltjük őket a GitHubra
echo "🚀 Kulcsok feltöltése a GitHubra..."

gh secret set AWS_ACCESS_KEY_ID -b "$AK"
gh secret set AWS_SECRET_ACCESS_KEY -b "$SAK"
gh secret set AWS_SESSION_TOKEN -b "$ST"

echo "✅ KÉSZ! A széf frissítve. Most már pusholhatsz!"