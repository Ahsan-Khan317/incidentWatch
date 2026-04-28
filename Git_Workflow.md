# IncidentWatch Git Guide (Beginner to Pro Friendly)

Welcome to the IncidentWatch project.
This guide helps you work with Git even if you are a complete beginner.

Follow the steps below in order.

---

# 1. Basic Idea (Very Simple)

- You will NOT push code directly to the main branch.
- You will create your own branch.
- Then create a Pull Request (PR).
- An admin will review and merge your code.

---

# 2. Branches (Easy Understanding)

```
main      -> live app (do not touch)
develop   -> team working branch
feature   -> your personal work
```

Always work on a feature branch.

---

# 3. Important Rules (MUST FOLLOW)

- Do NOT push to main.
- Do NOT push to develop.
- Do NOT use git push --force.
- Always create a new branch.
- Always create a Pull Request.
- Always pull latest code before starting.

---

# 4. First Time Setup (Only Once)

```bash
git clone <repo-url>
cd incidentWatch
git checkout develop
git pull origin develop
```

---

# 5. Start Working (Every Time)

Step 1: Go to develop

```bash
git checkout develop
git pull origin develop
```

Step 2: Create your branch

```bash
git checkout -b feature/your-feature-name
```

Example:

```bash
git checkout -b feature/login
```

---

# 6. Do Your Work

After coding:

```bash
git add .
git commit -m "feat: add login feature"
```

---

# 7. Push Your Code

```bash
git push origin feature/your-feature-name
```

---

# 8. Create Pull Request (PR)

1. Go to GitHub.
2. Open your branch.
3. Click "Compare & Pull Request".
4. Select:
   - Base: develop
   - Compare: your branch

---

# 9. After PR (Very Important)

- Wait for review.
- Fix changes if asked.
- Do NOT merge yourself (admin will do it).

---

# ADMIN ONLY: Sync develop to main

ONLY admin should run these commands to move approved changes into main:

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

---

# 10. Daily Update (Avoid Conflicts)

Always sync your code:

```bash
git checkout develop
git pull origin develop

git checkout feature/your-branch
git merge develop
```

---

# 11. If You Get Merge Conflict

Do not panic.

Steps:

1. Open conflicted file.
2. Fix manually.
3. Then:

```bash
git add .
git commit -m "fix: resolve merge conflict"
git push
```

---

# 12. Delete Branch (After Merge)

```bash
git branch -d feature/your-feature-name
```

---

# 13. Commit Message Rules (IMPORTANT)

Use this format:

```
feat: new feature
fix: bug fix
update: small change
refactor: improve code
docs: update docs
```

Example:

```
feat: add payment integration
fix: fix login error
```

---

# 14. Branch Naming Rules

```
feature/login
feature/payment
feature/order-flow
feature/admin-dashboard
```

Use simple names (no spaces).

---

# 15. Project Structure (Monorepo)

```
apps/
  frontend/
  backend/
packages/
  sdk/
  cli/
```

Work only in your assigned folder.

---

# 16. Common Mistakes (Avoid These)

- Working on main.
- Forgetting to pull latest code.
- Wrong branch PR.
- Big commits (too many changes at once).

---

# 17. If Something Goes Wrong

Undo last commit:

```bash
git reset --soft HEAD~1
```

Check branch:

```bash
git branch
```

Check changes:

```bash
git status
```

---

# 18. Full Workflow (Real Life Example)

```bash
1. git checkout develop
2. git pull origin develop
3. git checkout -b feature/cart
4. (do your work)
5. git add .
6. git commit -m "feat: add cart feature"
7. git push origin feature/cart
8. Create PR -> develop
```

---

# 19. Final Flow (Super Simple)

```
feature -> develop -> main
```

---

# 20. Common Issues and Fixes

Issue 1: Cannot push to develop/main

Error:

```
Cannot update this protected branch
```

Fix:

- Never push directly.
- Always create a feature branch.

```bash
git checkout -b feature/your-feature
git push origin feature/your-feature
```

---

Issue 2: PR merge blocked (Approval required)

Error:

```
At least 1 approving review is required
```

Fix:

- Ask teammate to approve, or an admin will merge.

---

Issue 3: Code not showing in main

Reason:

- PR merged into develop, not main.

Fix:

- Create PR: develop -> main.

---

Issue 4: develop behind main

Error:

```
This branch is behind main
```

Fix:

```bash
git checkout develop
git merge main
git push origin develop
```

---

Issue 5: Wrong branch name

Wrong:

```
docs/readme.md
```

Correct:

```
docs/readme
feature/login
```

---

Issue 6: Branch not pushing

Error:

```
no upstream branch
```

Fix:

```bash
git push -u origin branch-name
```

---

Issue 7: Accidentally deleted main branch

Fix:

```bash
git checkout develop
git checkout -b main
git push -u origin main
```

---

Issue 8: Extra useless branch created

Fix:

```bash
git checkout develop
git branch -d branch-name
```

---

Issue 9: Merge conflict

Fix:

1. Open file.
2. Fix manually.
3. Then:

```bash
git add .
git commit -m "fix: resolve conflict"
git push
```

---

Issue 10: Forgot to pull latest code

Fix:

```bash
git checkout develop
git pull origin develop
```

---

# Golden Rule

If Git blocks something, it is for safety.
Never try random commands.

---

# Need Help?

- Ask before doing anything risky.
- Never use force push.
- Follow the workflow strictly.

---

This guide ensures smooth collaboration.
Follow it and you will avoid Git issues.

---

# Final Notes

- Always ask if confused.
- Keep commits small and clean.
- Follow rules strictly.

---

# Team Message

We are building something amazing.
Let us keep code clean, organized, and professional.

Happy coding.
