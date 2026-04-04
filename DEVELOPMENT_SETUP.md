# 🚀 Zankoku Development Setup Guide

## 📋 Overview

This guide covers how to set up and run the Zankoku development server on Windows systems, addressing common PowerShell execution policy issues.

---

## ⚡ QUICK FIXES (Windows PowerShell Issues)

### 🚀 FASTEST FIX (Recommended)

**Open PowerShell as Administrator and run:**
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Press `Y` to confirm, then run:
```powershell
cd "C:\Users\USER\Desktop\zankoku-main"
npm install
npm run dev
```

### 🧠 EVEN EASIER (Zero Stress)

**Use Command Prompt (CMD) instead of PowerShell:**
1. Press `Win + R`
2. Type `cmd`
3. Run:
```cmd
cd C:\Users\USER\Desktop\zankoku-main
npm install
npm run dev
```

### ⚡ ALTERNATIVE (No System Changes)

**Temporary bypass:**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### 🔧 BACKUP WORKAROUND

**Force CMD version:**
```powershell
npm.cmd run dev
```

---

## 🔧 Prerequisites

### Required Software
1. **Node.js** (v18+ recommended)
   - Download from: https://nodejs.org/
   - Includes npm automatically

2. **Git** (for version control)
   - Download from: https://git-scm.com/

3. **PowerShell** (built into Windows)

---

## 🛠️ Installation Methods

### Method 1: PowerShell with Execution Policy Bypass (Recommended)

**Create a PowerShell script:**
```powershell
# File: start-dev.ps1
Write-Host "Starting Zankoku Development Server..." -ForegroundColor Cyan
Set-Location "C:\Users\USER\Desktop\zankoku-main"
npm run dev
```

**Run with execution policy bypass:**
```powershell
powershell -ExecutionPolicy Bypass -File start-dev.ps1
```

### Method 2: Batch File (Simplest)

**Create a batch file:**
```batch
@echo off
echo Starting Zankoku Development Server...
cd /d "C:\Users\USER\Desktop\zankoku-main"
npm run dev
pause
```

**Run by double-clicking the `.bat` file**

### Method 3: Direct PowerShell Commands

**One-time setup:**
```powershell
# Navigate to project directory
Set-Location "C:\Users\USER\Desktop\zankoku-main"

# Install dependencies (first time only)
powershell -ExecutionPolicy Bypass -Command "npm install"

# Start development server
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: PowerShell Execution Policy Error

**Error:**
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Why This Happens:**
Windows blocks scripts like `npm.ps1` because of security policies. When you run `npm run dev`, PowerShell says "running scripts is disabled".

**Solutions (Easiest First):**

**🧠 Option A: Use CMD Instead (Zero Stress)**
- CMD does NOT have this restriction
- Press `Win + R`, type `cmd`
- Run: `npm run dev`

**🚀 Option B: Permanent Fix (Recommended)**
```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
# Press Y to confirm
```

**⚡ Option C: Temporary Bypass**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

**🔧 Option D: Force CMD Version**
```powershell
npm.cmd run dev
```

### Issue 2: Path Not Found

**Error:**
```
Cannot find path 'C:\Users\USER\Desktop\zankoku-main'
```

**Solution:**
- Verify the project path is correct
- Use absolute paths in scripts
- Check if the folder exists

### Issue 3: Node.js Not Found

**Error:**
```
node : The term 'node' is not recognized as the name of a cmdlet
```

**Solution:**
- Install Node.js from https://nodejs.org/
- Restart PowerShell after installation
- Verify installation: `node --version`

### Issue 4: npm Not Working

**Error:**
```
npm : File npm.ps1 cannot be loaded
```

**Solution:**
- Use execution policy bypass: `powershell -ExecutionPolicy Bypass -Command "npm install"`
- Or use batch file approach

---

## 📁 Project Structure

```
zankoku-main/
├── start-dev.ps1          # PowerShell script
├── run-dev.bat            # Batch file
├── install-and-run.bat    # Install + run script
├── package.json          # Node.js dependencies
├── src/                  # Source code
└── public/               # Static assets
```

---

## 🎯 Quick Start Commands

### First Time Setup
```powershell
# Navigate to project
cd "C:\Users\USER\Desktop\zankoku-main"

# Install dependencies
powershell -ExecutionPolicy Bypass -Command "npm install"
```

### Daily Development

**🧠 Easiest (CMD):**
```cmd
cd C:\Users\USER\Desktop\zankoku-main
npm run dev
```

**🚀 PowerShell (After One-Time Fix):**
```powershell
cd "C:\Users\USER\Desktop\zankoku-main"
npm run dev
```

**⚡ Temporary Bypass:**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

**🔧 Backup Method:**
```powershell
npm.cmd run dev
```

---

## 🌐 Development Server

**Default URL:** http://localhost:5173

**Features:**
- Hot module replacement
- Live reloading
- Development tools
- Error overlay

**Stopping the server:**
- Press `Ctrl+C` in the terminal
- Or close the terminal window

---

## 🔍 Troubleshooting Checklist

### Before Running
- [ ] Node.js installed (`node --version`)
- [ ] npm available (`npm --version`)
- [ ] In correct directory (`pwd`)
- [ ] package.json exists

### Installation Issues
- [ ] Run with execution policy bypass
- [ ] Try batch file approach
- [ ] Check internet connection
- [ ] Clear npm cache: `npm cache clean --force`

### Runtime Issues
- [ ] Check port 5173 is available
- [ ] Verify all dependencies installed
- [ ] Check for TypeScript errors
- [ ] Review console output

---

## 📞 Getting Help

### Common Commands
```powershell
# Check Node.js version
node --version

# Check npm version  
npm --version

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Useful Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [PowerShell Execution Policies](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)

---

## 🧩 Quick Solution Summary

| Method                             | Best For             | Difficulty |
| ---------------------------------- | -------------------- | ---------- |
| **Use CMD instead of PowerShell**   | Zero stress 🧠       | Easiest    |
| **Set-ExecutionPolicy RemoteSigned** | Permanent fix ✅      | Easy       |
| **ExecutionPolicy Bypass**          | Temporary fix ⚡      | Medium     |
| **npm.cmd**                        | Backup workaround 🔧 | Medium     |

---

## � Success!

Once running successfully, you should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

The development server is now running and ready for development! 🚀
