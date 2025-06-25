import time
import os
import random
import glob

# This script simulates file activity to trigger WakaTime extension tracking.
# It randomly selects and touches files from the current and lower directories.

INTERVAL_SECONDS = 26  # WakaTime detects activity roughly every minute

def get_all_files():
    """Get all files from current directory and subdirectories, excluding certain patterns."""
    all_files = []
    
    # Walk through all directories starting from current directory
    for root, dirs, files in os.walk('.'):
        # Skip certain directories to avoid issues
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', '.venv', '.git', 'public', 'prisma']]
        
        for file in files:
            # Skip certain file types and hidden files
            if not file.startswith('.') and not file.endswith(('.pyc', '.log', '.tmp')) and file.endswith(('.js', 'tsx', '.ts', '.html', '.css')):
                file_path = os.path.join(root, file)
                all_files.append(file_path)
    
    return all_files

def modify_file(filename):
    """Make a small modification to a file to trigger WakaTime."""
    try:
        # Read the file content
        with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Add a comment at the end, then remove it to simulate activity
        comment_marker = f"# WakaTime activity marker {random.randint(1000, 9999)}"
        
        # First, add the comment
        with open(filename, 'a', encoding='utf-8') as f:
            f.write(f"\n{comment_marker}\n")
        
        # Wait a moment, then remove the comment
        time.sleep(2)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Modified: {filename}")
    except Exception as e:
        print(f"Could not modify {filename}: {e}")

if __name__ == "__main__":
    print("Simulating coding activity for WakaTime. Press Ctrl+C to stop.")
    try:
        while True:
            # Get all available files
            files = get_all_files()
            
            if files:
                # Randomly select a file to touch
                random_file = random.choice(files)
                modify_file(random_file)
            else:
                print("No suitable files found to touch.")
            
            time.sleep(INTERVAL_SECONDS)
    except KeyboardInterrupt:
        print("\nStopped by user.")