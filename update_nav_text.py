import os
import glob
import re

directory = "d:/PAGINA MAIZ"

# Find all HTML files
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace "Inteligencia Artificial" with "ñu´mu tu ia"
    # But only inside the navigation menu. 
    # Example: <a href="ia-maiz.html">Inteligencia Artificial</a>
    
    new_content = re.sub(r'(<a href="[^"]*ia-maiz\.html"[^>]*>)Inteligencia Artificial(</a>)', r'\1ñu´mu tu ia\2', content)
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes needed in {filepath}")
