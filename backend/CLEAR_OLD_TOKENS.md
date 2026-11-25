# Clear Old Tokens Issue

## Problem
After fixing the JWT token issue (converting user.id to string), old tokens in browser localStorage are still causing errors.

## Solution

### Option 1: Clear Browser Storage (Recommended)
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Click on Local Storage
4. Find your site (localhost:3000)
5. Delete `token` and `user` entries
6. Refresh the page
7. Login/Register again

### Option 2: Clear via Console
Open browser console and run:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
location.reload()
```

### Option 3: Use Incognito/Private Window
- Open a new incognito/private window
- This will have no cached tokens
- Login/Register fresh

## Why This Happens
- Old tokens were created with integer user.id
- New code expects string user.id
- Browser cached the old token
- Need to get a fresh token with the new format

