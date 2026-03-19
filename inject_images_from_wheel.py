import os
import re

# Mapeo exacto entre las páginas y los iconos PNG de la rueda principal
image_map = {
    # RAZAS
    "paginas/razas/arrocillo.html": "img-maiz-raza1.png",
    "paginas/razas/conico.html": "img-maiz-raza2.png",
    "paginas/razas/elotes-conicos.html": "img-maiz-raza3.png",
    "paginas/razas/cacahuacintle.html": "img-maiz-raza4.png",
    "paginas/razas/chalqueno.html": "img-maiz-raza5.png",
    "paginas/razas/chalqueno-bolita.html": "img-maiz-raza6.png",
    "paginas/razas/chalqueno-cacahuacintle.html": "img-maiz-raza7.png",
    "paginas/razas/chalqueno-conico.html": "img-maiz-raza8.png",
    "paginas/razas/conico-elotes-conicos.html": "img-maiz-raza9.png",
    "paginas/razas/conico-cacahuacintle.html": "img-maiz-raza10.png",
    "paginas/razas/conico-bolita.html": "img-maiz-raza11.png",
    "paginas/razas/conico-chalqueno.html": "img-maiz-raza12.png",
    "paginas/razas/conico-pepitilla.html": "img-maiz-raza13.png",
    "paginas/razas/tunicata.html": "img-maiz-raza15.png",
    "paginas/razas/azul.html": "img-maiz-color6.png", 
    "paginas/razas/negro.html": "img-maiz-color7.png", 
    
    # COLORES
    "paginas/colores/naranja.html": "img-maiz-color1.png",
    "paginas/colores/ocre.html": "img-maiz-color3.png",
    "paginas/colores/jaspe.html": "img-maiz-color4.png",
    "paginas/colores/tinto.html": "img-maiz-color5.png",
    "paginas/colores/azul.html": "img-maiz-color6.png",
    "paginas/colores/negro.html": "img-maiz-color7.png",
    "paginas/colores/pinto.html": "img-maiz-color8.png",
    "paginas/colores/blanco.html": "img-maiz-color9.png",
    "paginas/colores/crema.html": "img-maiz-color10.png",
    "paginas/colores/rojo.html": "img-maiz-color11.png",
    "paginas/colores/amarillo.html": "img-maiz-amarillo.png",
    "paginas/colores/morado.html": "img-maiz-color12.png", 
}

base_dir = r"d:\PAGINA MAIZ"

# Plantilla HTML inyectable con diseño premium (sombra y brillo tenue de fondo)
img_template = """
        <!-- Imagen ilustrativa inyectada automáticamente -->
        <div style="text-align: center; margin: 2rem 0;">
            <img src="../../imagenes/{img_name}" alt="Imagen representativa de la sub-página" style="max-width: 250px; height: auto; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%); padding: 15px;">
        </div>
"""

count = 0
for rel_path, img_name in image_map.items():
    filepath = os.path.join(base_dir, rel_path.replace("/", "\\"))
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Inyectar justo después de abrir la etiqueta <main>
        if '<!-- Imagen ilustrativa' not in content:
            main_match = re.search(r'(<main class="contenido-pagina"[^>]*>)', content, re.IGNORECASE)
            
            if main_match:
                insertion_point = main_match.end()
                new_content = content[:insertion_point] + "\n" + img_template.format(img_name=img_name) + content[insertion_point:]
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"ÉXITO: Inyectada {img_name} en {rel_path}")
                count += 1
            else:
                print(f"ADVERTENCIA: No se pudo inyectar en {rel_path} (No se encontró <main>)")
        else:
            print(f"SALTADO: Imagen ya presente en {rel_path}")
    else:
        print(f"ERROR: No se encontró el archivo {filepath}")

print(f"Total de páginas actualizadas con imágenes: {count}")
