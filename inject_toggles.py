import os

html_files = [
    ("teacher.html", '<button onclick="logout()" class="btn btn-secondary" style="width:100%;margin-top:0.75rem;justify-content:center;">'),
    ("parent.html", '<button onclick="logout()" class="btn btn-secondary" style="width:100%;margin-top:0.75rem;justify-content:center;">'),
    ("school.html", '<a class="nav-link" onclick="logoutSchool()">'),
    ("school-portal.html", '<a class="nav-link" onclick="logoutSchool()">'),
    ("admin.html", '          <a href="#" class="nav-item" onclick="ExamEdgeDB.logout(); return false;">\n            <i data-lucide="log-out"></i> Logout\n          </a>')
]

toggle_html = """
      <!-- Theme Toggle -->
      <button id="theme-toggle" onclick="toggleTheme()"
        style="display:flex; align-items:center; gap:10px;
               padding: 10px 16px; border-radius: 10px;
               background: rgba(255,255,255,0.05);
               border: 1px solid rgba(255,255,255,0.1);
               color: #9CA3AF; cursor:pointer;
               font-size:14px; width:100%;
               transition: all 0.2s ease; margin-bottom:0.75rem;">
        <i data-lucide="sun" style="width:16px;height:16px;"></i>
        Light Mode
      </button>
"""

header_toggle_html = """
      <!-- Theme Toggle -->
      <button id="theme-toggle" onclick="toggleTheme()"
        style="display:flex; align-items:center; gap:8px;
               padding: 6px 12px; border-radius: 8px;
               background: rgba(255,255,255,0.05);
               border: 1px solid rgba(255,255,255,0.1);
               color: #9CA3AF; cursor:pointer;
               font-size:13px; margin-right: 15px;
               transition: all 0.2s ease;">
        <i data-lucide="sun" style="width:14px;height:14px;"></i>
        Light Mode
      </button>
"""

for file, target in html_files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Inject toggle above target
        if target in content and 'id="theme-toggle"' not in content:
            content = content.replace(target, toggle_html + target)
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Injected toggle into {file}")

# Handle Header injects for non-sidebar pages
header_files = [
    ("landing.html", '<a href="register.html" class="px-5 py-2'),
    ("register.html", '<a href="landing.html" class="text-sm font-semibold text-indigo-400 hover:text-indigo-300">')
]

for file, target in header_files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if target in content and 'id="theme-toggle"' not in content:
            content = content.replace(target, header_toggle_html + target)
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Injected header toggle into {file}")
