# Snowflake Deployment Guide

This guide explains how to securely configure Snowflake credentials for production deployment.

## Overview

The LOIS application connects to Snowflake using private key authentication (more secure than password authentication). The credentials can be configured in two ways:

1. **Local Development**: Credentials stored in `.env` file and private key in `app_testing_rsa_key.p8` file
2. **Production (Vercel)**: Credentials stored as environment variables in Vercel dashboard

## Required Environment Variables

Add these environment variables to your Vercel project:

### Basic Configuration

```bash
SNOWFLAKE_ACCOUNT=SMB46128
SNOWFLAKE_USER=INTERNAL_INTEGRATION_USER
SNOWFLAKE_DATABASE=PRODUCT
SNOWFLAKE_SCHEMA=TESTING
SNOWFLAKE_WAREHOUSE=INTERNAL_INTEGRATIONS
SNOWFLAKE_ROLE=INTERNAL_INTEGRATION_ROLE
```

### Authentication (Private Key)

```bash
SNOWFLAKE_PRIVATE_KEY_PASSWORD=S50IrYonjehuyhZS2F
SNOWFLAKE_PRIVATE_KEY="-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFJDBWBgkqhkiG9w0BBQ0wSTAxBgkqhkiG9w0BBQwwJAQQi77YYPzgwOLJYSRE
YyuMJgICCAAwDAYIKoZIhvcNAgkFADAUBggqhkiG9w0DBwQI9pLlkUMyRe0EggTI
9p6ad3ao49kF4OyoMZmBzKYWY5wDL3mdS4sSCZ+VOTDJrrMUPXvG+F90brYZ4k2t
l9QG+oXBgklTfesA6mTJ/0AGx8K0UauGu7a4IM1voT9NL5aXhIUR2NMu1Us+lUOA
VdjR4fZW1m66zhFSAR3PMjBpaaSQJsLn/iarmLx8o5HkyHXer4SQ8KiEwVPP4F2W
tFIm2p9/LtTcl2ae0w8YUAi6XP+kIlnVSPgK6A98eKKtUZrQyIzcQ8oCixnC8XKs
LQcezyGsuPWNHOWiIEGqHxQcM6q+UKNXBn1d1w3wdzmBpXKINtMB8GAVIUgx/Bi/
+lIBpD3Z4zO8O0nT/TAoD+OxP1HGxpSdjxNgmsC6PDyokjGjyLDU/aXG7q7Xf3QU
CaCUxKmBAloJ2sy4N7aJ0VC5L8dML6WlwjGVe+a0G4eTphTg/kMQu9goz5aRG+aB
u3T+mea6gzPToxLow8F1U1DEFmfS/E7jconUNkCagrvRp72yMv5Y02DMc4D0vgVc
B+pNjlFw+07KuHmK7y8q1u4nGdl1kUSnEVXFJhlhgQpiMjlJjppYLIAda16zIEGX
5hV7DZvNFaC8TAyxK8tS3uHMRiXbltb9iGfWjIFU6qSyH2/So3cmf/3GG0oDRqT2
6GY2sVT73wseO4JzDo/D1yZhbaU/LeOKSddjKdcjG378OZYrenOAXSZsM2ehvbMH
DAAq6LpfpVBHTZPGKsl2cZxz9CwS6kFBiIWvNTwJcuvEVgogx8QabCdIX6OpEIMF
xQjnVgQeBbY6JEg9DmRNcfCj+Ssy1pwpUqkIj2BB+L62RdgP0apO27C/6AVT57hJ
R6fH2E7KAgxotsK/I+Chl3eRn4/QNj/AmMurMS1R2y3bEWLxZAsJelZWr9WNLE6K
QrcQW7yNRxgVW2zEYoQb91igZs1fGwV5WC478yED02K8K0HGY/Fub8JXZjw/HQzy
9On+z1mC9jt0Kn79LwIT1Q7HftDAGIW88l5BgB4LhHPLbwrGMvj2zrSxaKNCexSq
klHGkLuqvhDHJB3hqsnQqMz+P7OZO5fr/VyAtQCn908ZbMLh43H4Aa8MdYzpcaJE
HNJ3Y/w+x2pNcYseHPM1qo/pDwhPy5e7IItDFew5qi1hLLu9+WIc+zVs9lGdTS1A
vR3UEQjpui3yK0XcbDqGwbwS84ow+2FbMUMRH1BZq0MIlC0KMkyKYfMbrzwjU9+K
jo0yhRXrd8x5e+70nD2lZoC2rzHhJ0swSqikpfLJ2yvgACu67hZp8+Rs1AY6xw5k
CR/DyszguOubBKfV1dOS8WSuvaWA9nUc4hQy6w9P5/jWALWu/sw+ixu053s99ars
FF/IA8Muz4UvOnypRw35v9m4vF5bzALAvqRXEylDRIJTfEwR6A8V0wSC9iGok+l+
ZI5AOg9v67e91I1piyV0gv1MuZzNUMxjq6i9s6UPy+7TZwwdiFsAyGFLumoc3Plb
fTbneWUhmMmbxx9qWgEC41G3Xdrnx74MQQ3ye56IdCVKAqxvq1/1TWvJHGOiEwuW
HOr49RuIy0Tr9Le/SEnOAvOo1BMCa0A1skUj9gEOCoJN0h1TkRuC7u5Mt8DcLnxJ
kjfEoTCrTgMlWPJDfy7fGkqb4i0Jnfdg
-----END ENCRYPTED PRIVATE KEY-----"
```

**Important Notes:**
- The private key must be the complete multi-line string including the BEGIN/END markers
- Keep the line breaks intact when pasting into Vercel
- The key is encrypted, so the password (`SNOWFLAKE_PRIVATE_KEY_PASSWORD`) is required to decrypt it

### Alternative: Password Authentication (Less Secure)

If you prefer to use password authentication instead of private key:

```bash
SNOWFLAKE_PASSWORD=3E91g9zzln38nQrsnBIwss0
```

**Note:** Password authentication is less secure and not recommended for production.

## Setting Up in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your LOIS project
3. Go to **Settings** → **Environment Variables**
4. Add each environment variable:
   - Click "Add New"
   - Enter the Key (e.g., `SNOWFLAKE_ACCOUNT`)
   - Enter the Value (e.g., `SMB46128`)
   - Select environments: Production, Preview, Development (or as needed)
   - Click "Save"
5. Repeat for all variables listed above
6. Redeploy your application for changes to take effect

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add SNOWFLAKE_ACCOUNT production
vercel env add SNOWFLAKE_USER production
vercel env add SNOWFLAKE_DATABASE production
vercel env add SNOWFLAKE_SCHEMA production
vercel env add SNOWFLAKE_WAREHOUSE production
vercel env add SNOWFLAKE_ROLE production
vercel env add SNOWFLAKE_PRIVATE_KEY_PASSWORD production
vercel env add SNOWFLAKE_PRIVATE_KEY production

# Redeploy
vercel --prod
```

## How It Works

The application automatically detects the environment and loads credentials accordingly:

### Local Development
```typescript
// Loads from frontend/.env file
SNOWFLAKE_PRIVATE_KEY_PASSWORD=S50IrYonjehuyhZS2F

// Loads from frontend/app_testing_rsa_key.p8 file
// (File is automatically read if SNOWFLAKE_PRIVATE_KEY env var is not set)
```

### Production (Vercel)
```typescript
// All credentials loaded from environment variables
// Private key loaded from SNOWFLAKE_PRIVATE_KEY env var
// No local files needed
```

## Security Best Practices

1. **Never commit credentials to git**
   - The `.env` file is in `.gitignore`
   - The `app_testing_rsa_key.p8` file should NOT be committed
   - The `secrets_ml_app.env` file should NOT be committed

2. **Use private key authentication** instead of password authentication
   - More secure
   - Industry standard for service accounts
   - Easier to rotate without changing code

3. **Rotate credentials regularly**
   - Update the private key periodically
   - Update the password if using password auth

4. **Limit Snowflake role permissions**
   - The `INTERNAL_INTEGRATION_ROLE` should have minimal required permissions
   - Only grant access to necessary databases and schemas

## Testing the Connection

After setting up the environment variables, test the connection:

### Local Testing
```bash
cd frontend
npm run dev
curl http://localhost:5173/api/snowflake/test
```

### Production Testing
```bash
curl https://your-app.vercel.app/api/snowflake/test
```

Expected response:
```json
{
  "success": true,
  "connected": true,
  "message": "Successfully connected to Snowflake"
}
```

## Querying Data

The application can query the following view:
```sql
TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1
```

Example query:
```bash
curl -X POST https://your-app.vercel.app/api/snowflake/query \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1 LIMIT 10"}'
```

## Troubleshooting

### "Object does not exist or not authorized"
- Check that `SNOWFLAKE_ROLE` has access to the target database/schema
- Verify the database and schema names are correct
- Ensure the role is granted to the user

### "Incorrect username or password"
- If using private key auth: Check that `SNOWFLAKE_PRIVATE_KEY_PASSWORD` is correct
- If using password auth: Check that `SNOWFLAKE_PASSWORD` is correct
- Verify `SNOWFLAKE_USER` is correct

### "Invalid private key" error
- Ensure the private key includes the BEGIN/END markers
- Check that line breaks are preserved in the environment variable
- Verify the key format is PKCS8

### Connection timeout
- Check that `SNOWFLAKE_ACCOUNT` is correct (should be `SMB46128`)
- Verify the warehouse is running
- Check network/firewall settings

## Additional Resources

- [Snowflake Key Pair Authentication](https://docs.snowflake.com/en/user-guide/key-pair-auth.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env-static-private)
