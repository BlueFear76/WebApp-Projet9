#!/bin/bash

echo "🔁 Uploading environment variables to Railway..."

while IFS='=' read -r key value || [ -n "$key" ]; do
  # Skip empty lines or comments
  if [[ -z "$key" || "$key" =~ ^# ]]; then
    continue
  fi

  # Remove any surrounding quotes from the value
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"

  echo "📤 Setting $key"
  railway variables set "$key=$value"
done < .env

echo "✅ Done uploading all variables."
