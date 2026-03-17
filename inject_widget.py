import os
import glob
import re

# Definimos que vamos a escanear a través de toda nuestra página web del Maíz
directory = "d:/PAGINA MAIZ"

# Listamos recursivamente todos los documentos HTML sin importar en qué carpeta estén escondidos
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    # Abrimos la página actual en modo lectura para analizar su código estructural
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Objetivo Maestro: Queremos inyectar el "cerebro" (nuestro archivo javascript js/widget-ia.js) 
    # justo al final de la página, exactamente un renglón antes de que se cierre el <body>
    # Pero para no quebrar nada, primero revisamos si no se lo habíamos inyectado por accidente antes
    if 'widget-ia.js' not in content:
        # Magia matemática: Calculamos automáticamente las rutas relativas (cuántas carpetas hay que retroceder)
        # para que sin importar si la página está metida en una subcarpeta muy profunda, encuentre bien la carpeta principal 'js'
        rel_path = os.path.relpath(directory, os.path.dirname(filepath)).replace("\\", "/")
        if rel_path == '.':
            js_path = 'js/widget-ia.js'
        else:
            js_path = f'{rel_path}/js/widget-ia.js'
            
        # Construimos el código HTML con un bonito comentario de guía y la ruta exacta hacia el cerebro de la IA
        script_tag = f'\n    <!-- ====== WIDGET DE INTELIGENCIA ARTIFICIAL ====== -->\n    <script src="{js_path}"></script>\n</body>'
        
        # Realizamos la cirugía inyectándolo directamente en su posición anatómica final (reemplazando el viejo cierre body)
        new_content = content.replace('</body>', script_tag)
        
        # Sellamos la cirugía guardando la página modificada y vitaminada
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"¡Cerebro de Inteligencia Artificial exitosamente inyectado en: {filepath}")
    else:
        # Nos informa que aquí no hay trabajo qué hacer porque el paciente ya tenía su cerebro conectado
        print(f"La IA ya estaba presente, conectada y operando perfectamente en: {filepath}")
