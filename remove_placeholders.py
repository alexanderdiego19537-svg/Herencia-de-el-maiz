import glob
import re

# Directorio donde guardamos nuestras páginas principales
directory = "d:/PAGINA MAIZ/paginas"
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

# Nuestra misión aquí es cazar destructivamente los "placeholders" (textos genéricos de relleno)
# que decían "Galería Visual" y que se quedaron ahí cuando estábamos diseñando los primeros esqueletos.
pattern = re.compile(
    r'<section class="seccion">\s*<h2>Galería Visual</h2>\s*<div class="espacio-imagen">.*?</div>\s*</section>',
    re.DOTALL
)

count = 0
for filepath in html_files:
    # Abrimos cada archivo HTML para leer sus entrañas (código fuente)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Sustituimos el bloque detectado por nada (comillas vacías ''), es decir, lo borramos
    new_content, num_subs = pattern.subn('', content)
    
    # Si encontramos el bloque de relleno y lo borramos, sobreescribimos el archivo para guardar el cambio
    if num_subs > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Se eliminó una galería de relleno genérica en: {filepath}")
        count += 1

print(f"¡Misión cumplida! Total de archivos purgados: {count}")
