import os
import shutil

src = r"c:\Users\Fr Norbert\Desktop\examedge\logo.svg.svg"
dst = r"C:\Users\Fr Norbert\.gemini\antigravity-ide\brain\9f23dc86-a425-4ec1-8de6-dfb7f12634a6\logo.svg"
project_dst = r"c:\Users\Fr Norbert\Desktop\examedge\logo.svg"

if os.path.exists(src):
    # Rename in project
    shutil.move(src, project_dst)
    # Copy to artifacts for rendering
    shutil.copy2(project_dst, dst)
    print("Successfully moved and copied logo.svg")
else:
    print("Logo not found at", src)
