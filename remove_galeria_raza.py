import glob
import re

# Apuntamos específicamente a la carpeta donde viven las páginas de las razas de maíz
directory = "d:/PAGINA MAIZ/paginas/razas"
# Recopilamos todos los archivos HTML dentro de esta ruta
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

# Preparamos una búsqueda exacta (expresión regular) para cazar la sección completa
# que contenía la galería visual de "raza" que ya no necesitamos y estaba vacía.
pattern = re.compile(
    r'<section class="seccion">\s*<h2>Galería de la Raza</h2>\s*<div class="espacio-imagen">.*?</div>\s*</section>',
    re.DOTALL
)

count = 0
for filepath in html_files:
    # Leemos la página actual
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Intentamos borrar esa sección gráfica; 'num_subs' nos dirá cuántas veces la borró
    new_content, num_subs = pattern.subn('', content)
    
    # Si logramos detectar y borrar la galería, guardamos la página limpia
    if num_subs > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Sección de 'galería de la raza' removida exitosamente de: {filepath}")
        count += 1

print(f"¡Listo! Total de archivos limpiados: {count}")
