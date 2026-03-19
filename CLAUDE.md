# CHAPTERS App

React Native / Expo app. Bundle ID: `com.arshiachatterjee.chapters`, Team ID: `B93KRVL8V6`.

## TestFlight Deployment

**Always use the deploy script — do NOT use EAS, Transporter, or Xcode Organizer.**

```bash
./deploy_testflight.sh
```

This script:
1. Archives with `xcodebuild` (uses `DEVELOPMENT_TEAM=B93KRVL8V6`, `CODE_SIGN_STYLE=Automatic`)
2. Exports the IPA
3. Uploads to TestFlight via `xcrun altool` using App Store Connect API key

API Key: `4F9TZL3J6Q` — file at `~/.appstoreconnect/private_keys/AuthKey_4F9TZL3J6Q.p8`
Issuer ID: `511abd92-ad12-4efe-9a87-89ea862adc6b`

## Related Apps (same API key/team/issuer)

- `../EASE_app/` — EASE app, same deploy setup
- `../ASCEND_app/` — ASCEND app, same deploy setup
