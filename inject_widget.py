import os
import glob
import re

directory = "d:/PAGINA MAIZ"

# Find all HTML files
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to insert the script right before </body>
    if 'widget-ia.js' not in content:
        # Determine relative path to JS folder based on depth
        rel_path = os.path.relpath(directory, os.path.dirname(filepath)).replace("\\", "/")
        if rel_path == '.':
            js_path = 'js/widget-ia.js'
        else:
            js_path = f'{rel_path}/js/widget-ia.js'
            
        script_tag = f'\n    <!-- ====== WIDGET DE INTELIGENCIA ARTIFICIAL ====== -->\n    <script src="{js_path}"></script>\n</body>'
        new_content = content.replace('</body>', script_tag)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath} with widget.")
    else:
        print(f"Widget already present in {filepath}")
