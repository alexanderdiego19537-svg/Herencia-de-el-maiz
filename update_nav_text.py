import os
import glob
import re

# Directorio raíz donde vive nuestro proyecto del maíz
directory = "d:/PAGINA MAIZ"

# Buscamos absolutamente todos los archivos HTML (nuestras páginas) dentro de la carpeta y subcarpetas
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    # Abrimos cada archivo para leer su contenido asegurándonos de que los acentos se lean bien (utf-8)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Objetivo: Queremos cambiar el nombre genérico "Inteligencia Artificial" por el alma de nuestro proyecto: "ñu´mu tu ia"
    # Pero ojo, solo queremos hacer este cambio dentro del menú de navegación, no en cualquier texto al azar.
    # Ejemplo de lo que buscamos: <a href="ia-maiz.html">Inteligencia Artificial</a>
    
    # Usamos una expresión regular (una búsqueda inteligente) para encontrar ese enlace exacto y reemplazarle el texto
    new_content = re.sub(r'(<a href="[^"]*ia-maiz\.html"[^>]*>)Inteligencia Artificial(</a>)', r'\1ñu´mu tu ia\2', content)
    
    # Solo guardamos el archivo si realmente hubo un cambio, para no procesar de más
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"¡Éxito! Nombre de la IA actualizado en: {filepath}")
    else:
        print(f"Todo en orden, sin cambios necesarios en: {filepath}")
