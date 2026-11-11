# Sandesh weds Shagun – Digital Invitation

## What is inside
- **public/** – the invitation website (all pictures, fonts and text)
- **public/admin/** – the editing page
- **netlify/** – the small saving service (for edits, guest responses, photos and music)
- **netlify.toml, package.json** – settings for Netlify. Don't change these.

---

## Put it online (one time, about 10 minutes)

**1. Upload the files to GitHub**
1. Make a free account on github.com.
2. Click **+ → New repository**, name it `wedding-invitation`, and click **Create repository**.
3. Click **"uploading an existing file"**.
4. Unzip the file. Select **everything you see inside** (the folders `public` and `netlify`, and the files `netlify.toml`, `package.json`, `package-lock.json`, `HOW-TO-USE.md`) and drag them onto the page.
5. Click **Commit changes**.
6. Check: on your GitHub page you must see `public`, `netlify` and `netlify.toml` **straight away** (not inside another folder).

**2. Connect it to Netlify**
1. Log in at app.netlify.com (you can log in with GitHub).
2. Click **Add new site → Import an existing project → GitHub**, then choose `wedding-invitation`.
3. Leave all the boxes as they are and click **Deploy**.

**3. Set your admin password**
1. In Netlify, open your site → **Site configuration → Environment variables → Add a variable**.
2. Key: `ADMIN_PASSWORD` Value: a password only you know. Save.
3. Go to **Deploys → Trigger deploy → Deploy site** so the password takes effect.

**4. (Optional) A nicer link**
**Site configuration → Change site name**, e.g. `sandesh-weds-shagun` → your link becomes
`https://sandesh-weds-shagun.netlify.app`

Your invitation: `https://your-site.netlify.app`
Your editing page: `https://your-site.netlify.app/admin`

---

## Changing the invitation (any time, from phone or computer)

1. Open `your-site.netlify.app/admin` and log in with your password.
2. **Sections** tab
   - Click a section to open it, change the words, and press **Save changes** (top right).
   - **Switch** = show or hide the section.
   - **↑ ↓** = move the section up or down. **⧉** = make a copy. **✕** = delete.
   - **+ Add section** adds a new part (for example another event day).
   - Inside "Event day" you can add, remove or reorder functions (Haldi, Baraat, …).
   - **Preview changes** shows the result before you save.
3. **Settings, colours & music** tab – page title, colours, falling petals, countdown time, and **upload background music** (MP3, up to 5 MB).
4. **Pictures** – wherever you see "Upload", you can put in your own photo (Ganesh Ji, peacock, or a function picture). "Use built-in" puts back the original.
5. **Guest responses** tab – everyone who filled the "Will you join us?" form, with totals. **Download as Excel (CSV)** gives you the full list.
6. **Backup** tab – download a copy of everything, load an old copy, or reset to the original.

Changes show on the invitation immediately after **Save changes** – no re-upload needed.

## If the deploy still fails
- **Don't use "Deploy manually / drag and drop"** on Netlify. That method can't run the saving service. Always use **Import from GitHub**.
- If your GitHub page shows one folder (for example `wedding-invitation`) with everything inside it: in Netlify go to **Site configuration → Build & deploy → Build settings → Edit** and set **Base directory** to that folder name. Then **Deploys → Trigger deploy**.
- Still failing? In Netlify open **Deploys**, click the failed deploy, copy the red lines at the bottom of the log and send them to me.

## Good to know
- The "Will you join us?" form can be hidden with its switch if you don't want it.
- To show a WhatsApp reply link, open "Guest response form" and fill in the WhatsApp number with country code (e.g. 919812345678).
- Google Maps buttons: open the place in Google Maps → Share → Copy link → paste it into "Google Maps link".
- Line breaks you type in a box appear as new lines on the invitation.
