import os
import re

html_files = [
    "index.html",
    "teacher.html",
    "parent.html",
    "school.html",
    "school-portal.html",
    "admin.html",
    "register.html",
    "landing.html",
    "cbt.html"
]

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - not found")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements for background colors
    content = re.sub(r'bg-\[\#0[Bb]0[Ff]19\]', 'bg-[var(--bg-primary)]', content)
    content = re.sub(r'bg-\[\#0[Ff]0[Ff]1[Aa]\]', 'bg-[var(--bg-primary)]', content)
    content = re.sub(r'bg-\[\#111827\]', 'bg-[var(--bg-secondary)]', content)
    content = re.sub(r'bg-\[\#1[Ff]2937\]', 'bg-[var(--bg-secondary)]', content)
    
    # Replacing tailwind standard classes
    content = re.sub(r'\bbg-slate-900\b', 'bg-[var(--bg-primary)]', content)
    content = re.sub(r'\bbg-gray-900\b', 'bg-[var(--bg-primary)]', content)
    content = re.sub(r'\bbg-slate-800\b', 'bg-[var(--bg-secondary)]', content)
    content = re.sub(r'\bbg-gray-800\b', 'bg-[var(--bg-secondary)]', content)
    
    # Replacing text colors
    content = re.sub(r'\btext-white\b', 'text-[var(--text-primary)]', content)
    content = re.sub(r'text-\[\#[Ff]1[Ff]0[Ff]7\]', 'text-[var(--text-primary)]', content)
    content = re.sub(r'text-\[\#[Ff]9[Ff][Aa][Ff][Bb]\]', 'text-[var(--text-primary)]', content)
    content = re.sub(r'text-\[\#[Ff][Ff][Ff][Ff][Ff][Ff]\]', 'text-[var(--text-primary)]', content)
    
    content = re.sub(r'\btext-gray-400\b', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'\btext-slate-400\b', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'text-\[\#9[Cc][Aa]3[Aa][Ff]\]', 'text-[var(--text-secondary)]', content)
    
    content = re.sub(r'\btext-gray-500\b', 'text-[var(--text-muted)]', content)
    content = re.sub(r'\btext-slate-500\b', 'text-[var(--text-muted)]', content)
    content = re.sub(r'text-\[\#6[Bb]7280\]', 'text-[var(--text-muted)]', content)

    content = re.sub(r'\btext-indigo-400\b', 'text-[var(--accent-purple)]', content)
    content = re.sub(r'\btext-purple-500\b', 'text-[var(--accent-purple)]', content)
    
    # Border colors
    content = re.sub(r'\bborder-gray-800\b', 'border-[var(--border-color)]', content)
    content = re.sub(r'\bborder-slate-800\b', 'border-[var(--border-color)]', content)

    # Inline styles and complex tailwind classes
    content = content.replace('rgba(255, 255, 255, 0.04)', 'var(--bg-card)')
    content = content.replace('rgba(255,255,255,0.04)', 'var(--bg-card)')
    
    content = content.replace('rgba(255, 255, 255, 0.08)', 'var(--border-color)')
    content = content.replace('rgba(255,255,255,0.08)', 'var(--border-color)')

    content = content.replace('0 4px 24px rgba(0, 0, 0, 0.4)', 'var(--shadow)')
    content = content.replace('0 4px 24px rgba(0,0,0,0.4)', 'var(--shadow)')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed colors in {filepath}")

for f in html_files:
    process_file(f)
