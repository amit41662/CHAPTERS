#!/bin/bash
set -e

# CHAPTERS App — TestFlight Deployment Script
#
# Prerequisites:
#   - Xcode installed
#   - API key file at: ~/.appstoreconnect/private_keys/AuthKey_4F9TZL3J6Q.p8
#   - App Store Connect API Key ID: 4F9TZL3J6Q
#   - App Store Connect Issuer ID: 511abd92-ad12-4efe-9a87-89ea862adc6b
#   - Team ID: B93KRVL8V6
#   - Bundle ID: com.arshiachatterjee.chapters

WORKSPACE="ios/CHAPTERS.xcworkspace"
SCHEME="CHAPTERS"
ARCHIVE_PATH="ios/build/CHAPTERS.xcarchive"
IPA_DIR="ios/build/ipa"
EXPORT_OPTIONS="ios/ExportOptions.plist"
API_KEY="4F9TZL3J6Q"
API_ISSUER="511abd92-ad12-4efe-9a87-89ea862adc6b"

cd "$(dirname "$0")"

echo "==> Archiving..."
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -archivePath "$ARCHIVE_PATH" \
  -destination 'generic/platform=iOS' \
  DEVELOPMENT_TEAM=B93KRVL8V6 \
  CODE_SIGN_STYLE=Automatic \
  -allowProvisioningUpdates \
  | grep -E "(error:|ARCHIVE SUCCEEDED|ARCHIVE FAILED)"

echo "==> Exporting IPA..."
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$IPA_DIR" \
  -exportOptionsPlist "$EXPORT_OPTIONS" \
  -allowProvisioningUpdates \
  | grep -E "(error:|EXPORT SUCCEEDED|EXPORT FAILED)"

echo "==> Uploading to TestFlight..."
xcrun altool --upload-app --type ios \
  -f "$IPA_DIR/CHAPTERS.ipa" \
  --apiKey "$API_KEY" \
  --apiIssuer "$API_ISSUER"

echo ""
echo "Done! Check App Store Connect > TestFlight in ~5-30 minutes."
