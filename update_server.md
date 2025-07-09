# Update Command

## ✅ Command to Create a Shell Script

```bash
nano update_codexfrapp.sh
```

This opens the `nano` text editor where you can paste your script.

---

> Here:

> * `~` is shorthand for your home directory (`/home/sundar`).
> * So `~/frappe/apps/codexfrapp` = `/home/sundar/frappe/apps/codexfrapp`.

---

### ✅ Updated Script with Correct Path

```bash
#!/bin/bash

# Step 1: Go to the app directory
cd ~/frappe/apps/codexfrapp || {
  echo "❌ Failed to access app directory ~/frappe/apps/codexfrapp"
  exit 1
}

# Step 2: Pull the latest code from origin
git pull origin main

# Step 3: Switch to bench root
cd ~/frappe || {
  echo "❌ Failed to access bench root directory ~/frappe"
  exit 1
}

# Step 4: Run migrate
bench --site dev.aaranerp.com migrate

# Step 5: Pull latest changes from upstream
cd ~/frappe/apps/codexfrapp && git pull upstream main
```
---

### 🔒 Step 2: Save and Exit

In `nano`, press:

* `Ctrl + O` → to save
* `Enter` → to confirm filename
* `Ctrl + X` → to exit

---

### 🔧 Step 3: Make the script executable

```bash
chmod +x update_codexfrapp.sh
```

---

### ▶️ Step 4: Run the script

```bash
./update_codexfrapp.sh
```
