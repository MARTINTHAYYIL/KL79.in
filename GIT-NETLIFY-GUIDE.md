# Publishing KL79.in with Git + GitHub + Netlify

A complete beginner guide. You've already installed Git and committed
your folder locally, which means the hardest part (understanding what
a commit is) is already done. Now we put that local work online and
let Netlify auto-deploy it to kl79.in every time you push changes.

---

## Part A — Understand Git in 5 minutes

Git is a **time machine** for your folder. Every time you "commit",
you save a snapshot. You can go back to any old snapshot, see what
changed, undo mistakes, etc.

Here are the only concepts you need to know:

- **Repository (repo)** — your folder + all its history. The `.git`
  hidden folder inside `Final/` is the history database.
- **Commit** — a saved snapshot with a message like "fixed font".
  You've already made one.
- **Remote** — another copy of your repo living somewhere else
  (like GitHub). Think of it as "cloud backup of your time machine".
- **Push** — upload your local commits to the remote. (You → cloud.)
- **Pull** — download commits from the remote to your local copy.
  (Cloud → you.) You won't need this much until you work from
  multiple computers.
- **Branch** — a parallel timeline. For now, just use `main`.
- **GitHub** — a free website that hosts remote repos. Netlify reads
  your code from GitHub to build your site.

That's genuinely all you need. The commands below will make sense
once you see them in action.

---

## Part B — Push your folder to GitHub (one-time setup)

### Step 1: Create a GitHub account

1. Go to **https://github.com/signup**
2. Enter your email (use `martin.bethenynursingcare@gmail.com`),
   a password, and a username. Pick something short like `kl79-in`
   or `martin-kl79`.
3. Verify your email.

### Step 2: Create an empty repo on GitHub

1. After logging in, click the green **New** button (or go to
   https://github.com/new).
2. **Repository name:** `kl79.in` (or `kl79-website` — anything
   you like; lowercase, no spaces).
3. **Description** (optional): *KL79.in — Kasaragod bus/train timings
   and local info.*
4. Keep it **Public** (free Netlify deploys need either Public or
   a paid GitHub plan for Private; Public is simpler).
5. **IMPORTANT:** Do NOT tick any of "Add README", "Add .gitignore",
   or "Add license". Leave the repo empty. You'll push your existing
   files into it.
6. Click **Create repository**.

### Step 3: Copy the remote URL

On the next page you'll see a box with instructions. Find the one
that looks like:

```
git remote add origin https://github.com/YOUR-USERNAME/kl79.in.git
```

Copy that URL (e.g. `https://github.com/kl79-in/kl79.in.git`).

### Step 4: Connect your local folder to that remote

Open a terminal (Command Prompt or PowerShell or Git Bash) in your
project folder. Easiest way: open File Explorer in
`C:\Users\BETHENY NURSIN CARE\Desktop\KL79.in\Final`, click in
the address bar, type `cmd`, press Enter. A Command Prompt opens
in that folder.

Tell Git who you are (first time only, on this computer):

```
git config --global user.name "Martin"
git config --global user.email "martin.bethenynursingcare@gmail.com"
```

Now link the folder to GitHub (paste the URL you copied):

```
git remote add origin https://github.com/YOUR-USERNAME/kl79.in.git
```

Rename your local branch to `main` (GitHub's default):

```
git branch -M main
```

### Step 5: Push your code

```
git push -u origin main
```

The first time you run this, a window will pop up asking you to
sign in to GitHub. Do it — it'll remember forever after.

When it finishes, refresh the GitHub page for your repo. You should
see all your HTML, JS, CSS files listed.

**That's it — your code is now on GitHub.** Pat yourself on the back.

---

## Part C — Connect Netlify to your GitHub repo

### Step 1: Create a Netlify account (if you haven't)

1. Go to **https://app.netlify.com/signup**.
2. Click **GitHub** to sign up — this pre-authorises the two
   services to talk to each other.
3. Approve the permissions GitHub asks for.

### Step 2: Import your repo

1. Once logged in, click **Add new site** → **Import an existing project**.
2. Click **GitHub** (or "Deploy with GitHub").
3. Netlify will show your GitHub repos. Pick `kl79.in`.
4. Netlify will show "Deploy settings" — you can leave everything
   at the defaults:
   - **Branch to deploy**: `main`
   - **Build command**: (leave blank — static site)
   - **Publish directory**: (leave blank — it publishes the root)
5. Click **Deploy kl79.in**.
6. Wait ~30 seconds. You'll see a URL like
   `https://glittering-macaron-12ab34.netlify.app` — click it and
   your site is live on the internet.

### Step 3: Rename the Netlify site (optional)

In Netlify → your site → **Site configuration** → **Change site
name** → set it to `kl79` so you get `kl79.netlify.app`. Easier
to type while testing, and your custom domain will replace it anyway.

---

## Part D — Connect your kl79.in domain

1. In your Netlify site dashboard, click **Domain management**
   (or **Set up a custom domain**).
2. Click **Add a domain** and enter `kl79.in`. Click **Verify**.
3. Netlify shows you DNS records to add — usually:

   | Type  | Host | Value                   |
   |-------|------|-------------------------|
   | A     | @    | 75.2.60.5               |
   | CNAME | www  | YOUR-SITE.netlify.app   |

   (Use the exact values Netlify gives you, not these examples.)

4. Log in where you bought `kl79.in` (GoDaddy, Namecheap, BigRock,
   Hostinger, etc.) and open the **DNS management** page for kl79.in.
5. **Delete** any existing A records and CNAME records for `@` and
   `www`. Keep any MX records (those are for email).
6. **Add** the records Netlify gave you, exactly as shown.
7. Save. Go back to Netlify and click **Verify DNS configuration**.
   Give it 10–30 minutes for DNS to spread.
8. Once verified, Netlify automatically issues a free HTTPS
   certificate. Your site is live at **https://kl79.in** with the
   padlock in the address bar.

---

## Part E — Daily workflow (this is the magic part)

Once Part B, C, D are done, you never touch Netlify's UI again.
Your normal day looks like this:

1. Edit a file in `Final/` (change a bus timing, update a phone
   number, whatever).
2. Test locally — double-click `serve.bat`, view it at
   `http://localhost:8080`, confirm it looks right.
3. Open Command Prompt in the `Final/` folder.
4. Run three commands:

   ```
   git add .
   git commit -m "Update Chittarikkal 6am bus"
   git push
   ```

5. Within ~30 seconds Netlify auto-detects the push, rebuilds,
   and kl79.in is updated. You'll even get an email notification.

That's it. No drag-and-drop. No "which file did I forget to upload?"
No version confusion. The site always matches what's on GitHub.

---

## Part F — Git cheat sheet

Drop these into Command Prompt whenever you need them. Run them
from inside `C:\Users\BETHENY NURSIN CARE\Desktop\KL79.in\Final`.

| Task | Command |
|------|---------|
| See what changed since last commit | `git status` |
| See what exact changes you made | `git diff` |
| Stage all changes for commit | `git add .` |
| Stage one file only | `git add Chittarikkal.html` |
| Commit staged changes with a message | `git commit -m "your message"` |
| Push commits to GitHub | `git push` |
| Pull latest from GitHub | `git pull` |
| See your commit history | `git log --oneline` |
| Undo changes to a file (before commit) | `git checkout -- filename.html` |
| See which remote is connected | `git remote -v` |

**Writing good commit messages:** keep them short, in imperative
mood. Good: `"Add 5am Kanhangad bus"`. Bad: `"changes"`, `"update"`,
`"stuff"`. Future-you will thank present-you.

---

## Part G — If something goes wrong

**"fatal: remote origin already exists"**
You already ran `git remote add origin` before. Either:

```
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/kl79.in.git
```

**"Updates were rejected because the remote contains work you do not have"**
This happens if you tick "add README" when creating the GitHub repo.
Force your local copy to win:

```
git pull origin main --allow-unrelated-histories
git push
```

**"Permission denied" or login loops**
The GitHub CLI authentication got stuck. In Command Prompt run:

```
git config --global credential.helper manager-core
```

Then retry `git push` — the browser will open to re-sign-in.

**Netlify deploy failed**
Click the failed deploy in Netlify to see the log. For a static site
like ours, this is almost always due to a filename-case issue (e.g.
a link to `/business.html` but file is `Business.html`) or a missing
file. Fix and push again — Netlify auto-retries.

**DNS not working after a day**
Use https://dnschecker.org/ to check if the new A record is visible
worldwide. If it still shows the old value, check your registrar's
DNS page again — sometimes it needs an extra "Save" click.

---

## What to do right now

You said you already installed Git and did a local commit. Perfect.
Your next concrete steps are:

1. **Part B, Step 1–5**: Create GitHub account, create empty repo,
   run the four commands (`git remote add`, `git branch -M main`,
   `git push -u origin main`). ~5 minutes.
2. **Part C, Step 1–3**: Sign up for Netlify with GitHub, import
   your repo, watch it deploy. ~5 minutes.
3. **Part D**: Point kl79.in DNS at Netlify. ~10 minutes, then wait.

If you hit any error message you don't understand, paste it back
to me and I'll explain what it means and what to do.
