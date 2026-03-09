import glob
import re

directory = "d:/PAGINA MAIZ/paginas"
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

# Regex to match the Galería Visual section exactly
pattern = re.compile(
    r'<section class="seccion">\s*<h2>Galería Visual</h2>\s*<div class="espacio-imagen">.*?</div>\s*</section>',
    re.DOTALL
)

count = 0
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content, num_subs = pattern.subn('', content)
    
    if num_subs > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed placeholder gallery from {filepath}")
        count += 1

print(f"Total files updated: {count}")
