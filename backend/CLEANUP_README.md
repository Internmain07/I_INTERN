# Database Cleanup Tools

This folder contains utility scripts to help you clean up test data from the database and maintain database health.

## Available Tools

### 1. Interactive Cleanup Tool (Recommended)
**File:** `cleanup_database.py`

This is an easy-to-use interactive menu-driven tool that lets you:
- View all internships in the database
- Remove internships with 'test' in the title
- Remove internships by company
- Remove internships posted before a specific date
- Remove ALL internships (use with caution!)
- View database statistics

**Usage:**
```bash
cd backend
python cleanup_database.py
```

Then follow the on-screen menu!

---

### 2. Command-Line Cleanup Tool (Advanced)
**File:** `remove_test_internships.py`

This is a command-line tool for more advanced users who want to script the cleanup.

**Usage Examples:**

**Dry run (shows what would be deleted without actually deleting):**
```bash
python remove_test_internships.py --test --dry-run
```

**Remove internships with 'test' in title:**
```bash
python remove_test_internships.py --test
```

**Remove internships for a specific company:**
```bash
python remove_test_internships.py --company-id YOUR_COMPANY_ID
```

**Remove internships posted before a date:**
```bash
python remove_test_internships.py --before-date 2024-01-01
```

**Remove ALL internships (⚠️ DANGER!):**
```bash
python remove_test_internships.py --all --dry-run  # First, see what will be deleted
python remove_test_internships.py --all            # Then actually delete
```

**Combined filters:**
```bash
python remove_test_internships.py --test --before-date 2024-06-01 --dry-run
```

**Available Options:**
- `--all` - Remove all internships (use with extreme caution!)
- `--test` - Remove internships with 'test' in title (default behavior)
- `--dry-run` - Show what would be deleted without actually deleting
- `--company-id <ID>` - Remove internships for a specific company
- `--before-date <YYYY-MM-DD>` - Remove internships posted before this date
- `--help` or `-h` - Show help message

---

### 3. Database Health Check & Repair Tool
**File:** `fix_database.py`

This tool checks and repairs database integrity issues, such as orphaned applications (applications that reference deleted internships).

**Usage Examples:**

**Check database health:**
```bash
python fix_database.py --health
```

**Fix orphaned applications (with confirmation):**
```bash
python fix_database.py --fix
```

**Show help:**
```bash
python fix_database.py --help
```

---

## Safety Features

All tools include safety features:

1. **Preview before deletion** - You always see what will be deleted before confirming
2. **Confirmation prompts** - You must explicitly confirm dangerous operations
3. **Dry run mode** - Test the command-line tool without making changes
4. **Application cascade** - Applications are automatically deleted when their internship is deleted
5. **Foreign key safety** - Proper handling of database relationships to prevent constraint violations

---

## Important Notes

⚠️ **Warning:** Deleting internships will also delete all applications for those internships!

⚠️ **Database Integrity:** If you encounter errors when deleting internships, run `python fix_database.py --health` to check for issues.

✓ **Tip:** Always use `--dry-run` first with the command-line tool to see what will be deleted.

✓ **Recommendation:** Use the interactive tool (`cleanup_database.py`) if you're not comfortable with command-line options.

---

## Prerequisites

Make sure you have:
1. Python virtual environment activated
2. All dependencies installed (`pip install -r requirements.txt`)
3. Valid `.env` file with `DATABASE_URL` configured
4. Backend server is NOT running (to avoid conflicts)

---

## Quick Start

**For beginners:**
```bash
cd backend
python cleanup_database.py
# Select option 2 to remove test internships
```

**For advanced users:**
```bash
cd backend
python remove_test_internships.py --test --dry-run
python remove_test_internships.py --test
```

---

## Need Help?

If you encounter any issues:
1. Make sure your database connection is working
2. Check that your `.env` file has the correct `DATABASE_URL`
3. Ensure the backend virtual environment is activated
4. Look at the error message for clues

For more help, check the main project README or contact support.
