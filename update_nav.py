import os
import glob
import re

directory = "d:/PAGINA MAIZ"

# Find all HTML files
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to insert the IA link right after Herencia de Semillas or before Reconocimiento
    # Let's match the Reconocimiento link to extract its relative path
    # Example: <li><a href="../categorias/reconocimiento.html">Reconocimiento</a></li>
    match = re.search(r'<li><a href="([^"]*)reconocimiento\.html"(?: class="activo")?>Reconocimiento</a></li>', content)
    
    if match:
        prefix = match.group(1)
        # New link
        new_link = f'<li><a href="{prefix}ia-maiz.html">Inteligencia Artificial</a></li>\n                {match.group(0)}'
        
        # Replace the original line with the new line + original line
        new_content = content.replace(match.group(0), new_link)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"Match not found in {filepath}")
