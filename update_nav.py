import os
import glob
import re

# El corazón del proyecto, donde apuntamos a todas las carpetas
directory = "d:/PAGINA MAIZ"

# Buscamos absolutamente todas las páginas web (HTML) para actualizarlas de golpe mediante automatización
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    # Leemos todo el código interno (código fuente) de la página actual respetando los acentos en español
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Queremos inyectar de forma inteligente el enlace hacia nuestro chat de la Inteligencia Artificial, 
    # justo antes de la sección de "Reconocimiento" en la barra de navegación superior.
    # Ejemplo de la guía visual que usa este script-robot para encontrar dónde inyectarlo: 
    # <li><a href="../categorias/reconocimiento.html">Reconocimiento</a></li>
    match = re.search(r'<li><a href="([^"]*)reconocimiento\.html"(?: class="activo")?>Reconocimiento</a></li>', content)
    
    if match:
        # El 'prefix' es la ruta matemática (los ../../ calculados) para que el enlace hacia la IA nunca se rompa
        prefix = match.group(1)
        
        # Construimos nuestro nuevo botón brillante para la Inteligencia Artificial
        new_link = f'<li><a href="{prefix}ia-maiz.html">Inteligencia Artificial</a></li>\n                {match.group(0)}'
        
        # Reemplazamos la vieja barra de navegación incrustando mágicamente nuestro nuevo eslabón de IA
        new_content = content.replace(match.group(0), new_link)
        
        # Guardamos la página modificada
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Menú de navegación actualizado exitosamente con la IA en: {filepath}")
    else:
        # Si una página en particular no tenía el botón o tenía otra estructura, el robot nos avisa
        print(f"Advertencia: No se encontró la guía para insertar la IA en {filepath}")
