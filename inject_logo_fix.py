import os
import re

html_files = [
    "index.html", "teacher.html", "parent.html", 
    "school.html", "school-portal.html", "admin.html", 
    "register.html", "landing.html", "cbt.html"
]

logo_tag = '<img src="logo.svg" alt="PrepFast Logo" class="ee-icon-lg" style="width: 2.2rem; height: 2.2rem; display: block; margin: auto;">'

for filepath in html_files:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the specific lucide icon in the sidebar/headers
    # E.g. <i data-lucide="graduation-cap" class="ee-icon-lg"></i>
    
    # 1. Replace the graduation-cap icon with the image tag
    content = re.sub(r'<i data-lucide="graduation-cap"[^>]*></i>', logo_tag, content)
    
    # 2. Also replace building/shield icons if they act as logos (e.g. in school/admin portals)
    # Admin portal uses <i data-lucide="shield"></i> in the logo-icon div
    content = re.sub(r'<div class="logo-icon">\s*<i data-lucide="shield"[^>]*></i>\s*</div>', 
                     f'<div class="logo-icon" style="background: transparent; box-shadow: none; padding: 0;">\n        {logo_tag}\n      </div>', content)
                     
    # School portal uses <i data-lucide="building"></i> in the logo-icon div
    content = re.sub(r'<div class="logo-icon">\s*<i data-lucide="building"[^>]*></i>\s*</div>', 
                     f'<div class="logo-icon" style="background: transparent; box-shadow: none; padding: 0;">\n        {logo_tag}\n      </div>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Fixed logo in {filepath}")
