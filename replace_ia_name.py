import glob

directory = "d:/PAGINA MAIZ"
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Capitalizing properly to look more professional
    new_content = content.replace("ñu´mu tu ia", "IA ñu'mu")
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
