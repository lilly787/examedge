import os
import re

html_files = [
    "index.html", "teacher.html", "parent.html", 
    "school.html", "school-portal.html", "admin.html", 
    "register.html", "landing.html", "cbt.html"
]

logo_tag = '<img src="logo.svg" alt="PrepFast Logo" class="ee-icon" style="width: 28px; height: 28px;">'
logo_tag_lg = '<img src="logo.svg" alt="PrepFast Logo" class="ee-icon" style="width: 2.2rem; height: 2.2rem;">'
logo_tag_nav = '<img src="logo.svg" alt="PrepFast Logo" style="width: 24px; height: 24px;">'

for filepath in html_files:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Standard Sidebar logo replacement
    content = re.sub(r'<div class="logo-icon">\s*<i data-lucide="[^"]+"></i>\s*</div>', 
                     f'<div class="logo-icon" style="background: transparent; box-shadow: none; padding: 0;">\n        {logo_tag}\n      </div>', content)
                     
    # 2. Large Mobile logo replacement
    content = re.sub(r'<div class="logo-icon-lg">\s*<i data-lucide="[^"]+" class="ee-icon" style="[^"]+"></i>\s*</div>', 
                     f'<div class="logo-icon-lg" style="background: transparent; box-shadow: none; padding: 0;">{logo_tag_lg}</div>', content)
                     
    # 3. Landing page nav logo replacement
    content = re.sub(r'<div class="nav-logo-icon">\s*<span class="icon"[^>]*>[\s\S]*?</svg>\s*</span>\s*</div>',
                     f'<div class="nav-logo-icon" style="background: transparent;">\n        {logo_tag_nav}\n      </div>', content)
                     
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Injected logo into {filepath}")
