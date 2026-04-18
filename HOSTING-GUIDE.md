# KL79.in — Hosting Guide

This guide takes you step-by-step from **testing on your own PC** to
**going live on kl79.in** using **Netlify** (completely free).

No prior experience required. Just follow in order.

---

## Part 1 — Test the site on your own PC (local)

### Step 1: Install Python (one-time, ~3 minutes)

If you don't have Python:

1. Go to https://www.python.org/downloads/
2. Click the big yellow **Download Python** button.
3. Run the installer.
4. **IMPORTANT** — On the first screen, tick the box that says:
   *"Add Python to PATH"*
5. Click **Install Now**. Done.

> *Already have Python or Node.js? Skip straight to Step 2.*

### Step 2: Start the local server

1. Open the folder: `C:\Users\BETHENY NURSIN CARE\Desktop\KL79.in\Final`
2. Double-click **`serve.bat`**
3. A black window will open and show:
   ```
   Serving HTTP on 0.0.0.0 port 8080 ...
   ```
4. Leave that window open.

### Step 3: Open the site in your browser

Open your browser and visit: **http://localhost:8080**

You should see the KL79.in homepage exactly as visitors will see it.
Try the search box, click a few bus pages — everything should work.

### Step 4: Stop the server when you're done

Click back in the black window and press **Ctrl+C**, then close it.

> *Tip:* every time you edit a file, just **refresh the browser** to see
> the change. No need to restart the server.

---

## Part 2 — Publish to Netlify (free, ~10 minutes)

Netlify hosts static websites like yours for **free, forever**, with
free HTTPS (the padlock in the address bar) and free CDN (fast loading
worldwide).

### Step 1: Create a free Netlify account

1. Go to https://app.netlify.com/signup
2. Sign up with your Google account (fastest) or email.
3. When it asks "What kind of work do you do?", any answer is fine.

### Step 2: Deploy by drag-and-drop (easiest)

1. After signing in, click **Sites** in the left menu.
2. Scroll down to the section that says:

   > *"Want to deploy a new site without connecting to Git?*
   > *Drag and drop your site output folder here"*

3. Open File Explorer and navigate to:
   `C:\Users\BETHENY NURSIN CARE\Desktop\KL79.in\Final`
4. Select the **Final** folder itself (or select ALL files inside it
   with Ctrl+A).
5. **Drag it onto the Netlify page**.
6. Wait ~30 seconds. Netlify will give you a random URL like
   `https://glittering-macaron-12ab34.netlify.app`.
7. Click the URL — your site is live on the internet!

### Step 3: Rename the Netlify site (optional but nice)

1. Click **Site configuration** → **Change site name**.
2. Change it to something like `kl79` → gives you `kl79.netlify.app`.

### Step 4: Connect your own kl79.in domain

1. On the Netlify site dashboard click **Domain management** (or
   **Set up a custom domain**).
2. Click **Add a domain** and type `kl79.in`. Click **Verify**.
3. Netlify will show you **DNS records** that look like this:

   | Type  | Name | Value                  |
   |-------|------|------------------------|
   | A     | @    | 75.2.60.5              |
   | CNAME | www  | your-site.netlify.app  |

   (The exact values Netlify shows you **may differ** — use theirs, not
   these samples.)

4. Now log in to where you bought the domain (GoDaddy, Namecheap,
   BigRock, Hostinger, etc.).
5. Find the **DNS Management** page for kl79.in.
6. **Delete** any existing A records and CNAME records for `@` and
   `www` (keep MX records if you use email on the domain).
7. **Add** the records Netlify gave you exactly as shown.
8. Save. Come back to Netlify after 10–30 minutes and click
   **Verify DNS configuration**.
9. Netlify will automatically issue a free SSL/HTTPS certificate.
   Your site is now at **https://kl79.in** ✅

> *DNS changes can take up to 24 hours to fully propagate worldwide,
> but usually work within 1 hour.*

### Step 5: Pushing future updates

Every time you change a file on your PC:

1. Test locally with `serve.bat` first.
2. Go to Netlify → your site → **Deploys** tab.
3. Scroll to the bottom and drag the **Final** folder onto the
   "Drag and drop your folder here" area labelled **"Need to update
   your site? Drag and drop your site output folder here"**.
4. In ~30 seconds, kl79.in is updated.

That's it — you never need Bolt again.

---

## Part 3 — (Later, optional) Use GitHub for auto-deploy

This is the "professional" setup. Skip unless you want to learn it.

Instead of dragging-and-dropping, you keep your files in a **GitHub**
repository. Netlify watches that repository, and every time you push
a change, Netlify rebuilds the site automatically.

Benefits: free backups, easy history, undo any change, collaborate.

When you're ready, the rough steps are:

1. Install **GitHub Desktop**: https://desktop.github.com/
2. Create a new repository → point it at your `Final` folder.
3. Publish repository to GitHub (mark it private if you want).
4. On Netlify: **Add new site → Import an existing project →
   Deploy with GitHub → pick the repo**.
5. From now on: change a file → commit → push → site updates
   automatically.

---

## Troubleshooting

**"python is not recognized as an internal or external command"**
→ You forgot to tick *"Add Python to PATH"* during install. Re-run
the Python installer, choose **Modify**, tick the PATH option, finish.

**Port 8080 already in use**
→ Edit `serve.bat` and change `8080` to `8000` or `3000`.

**After deploying, some pages show 404**
→ Usually a filename-case mismatch. On Windows local testing this
works, but Netlify (Linux) is case-sensitive. If you see 404s,
tell me which page and I'll fix the link.

**Domain not connecting after 1 hour**
→ Double-check you removed old A/CNAME records at your registrar.
Use https://dnschecker.org/ to see if the new records are visible
worldwide.

---

## Quick reference

| What | Command / Action |
|------|------------------|
| Test locally | Double-click `serve.bat` → visit http://localhost:8080 |
| Stop local server | Ctrl+C in the black window |
| Deploy to Netlify | Drag `Final` folder onto Netlify deploys page |
| Edit a file | Save the file, refresh browser (local) or redeploy (live) |

Need help with any step? Just ask.
