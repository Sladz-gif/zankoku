# 🚀 Windsurf Prompt: Fix PowerShell npm Execution Error (Zankoku Project)

## 🎯 Objective

Fix the PowerShell execution policy error preventing `npm` commands from running in a Windows development environment for the Zankoku project.

---

## 🧠 Problem Context

When attempting to run:

```
npm run dev
```

PowerShell throws an error similar to:

```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

This happens because Windows PowerShell restricts script execution by default.

---

## ✅ Required Fix (Primary Solution)

Update the PowerShell execution policy for the current user to allow locally created scripts.

### Command to Execute:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Expected Interaction:

* Prompt appears asking for confirmation
* User types: `Y` and presses Enter

---

## ⚡ Alternative Fix (Temporary Bypass)

If permanent policy change is not desired, run npm commands using execution policy bypass:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

---

## 🧩 Backup Workarounds

### Option 1: Use Command Prompt Instead of PowerShell

```cmd
cd C:\Users\USER\Desktop\zankoku-main
npm install
npm run dev
```

### Option 2: Force npm CMD Version

```powershell
npm.cmd run dev
```

---

## 📁 Project Path

Ensure all commands are executed inside:

```
C:\Users\USER\Desktop\zankoku-main
```

---

## 🧪 Verification Steps

After applying the fix:

1. Run:

   ```powershell
   npm run dev
   ```

2. Confirm development server starts successfully

3. Expected output:

   ```
   VITE v5.x.x ready
   Local: http://localhost:5173/
   ```

---

## ⚠️ Notes for Windsurf

* Do NOT modify system-wide execution policy unless necessary
* Prefer `CurrentUser` scope for safety
* Ensure Node.js and npm are installed and available in PATH
* Do not alter project files; this is an environment fix

---

## 🎉 Expected Outcome

* PowerShell no longer blocks npm scripts
* `npm install` and `npm run dev` execute successfully
* Zankoku development server runs locally without errors
