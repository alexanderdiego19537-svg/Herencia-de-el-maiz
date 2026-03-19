from duckduckgo_search import DDGS
import requests
import os

imagenes_dir = r"d:\PAGINA MAIZ\imagenes"
if not os.path.exists(imagenes_dir):
    os.makedirs(imagenes_dir)

def buscar_y_descargar(query, filename):
    filepath = os.path.join(imagenes_dir, filename)
    if os.path.exists(filepath):
        print(f"Ya existe {filename}, saltando...")
        return

    try:
        # Iniciamos búsqueda libre de API Key
        results = DDGS().images(query, max_results=1)
        if results:
            url = results[0]['image']
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            img_response = requests.get(url, headers=headers, timeout=10)
            
            if img_response.status_code == 200:
                with open(filepath, 'wb') as handler:
                    handler.write(img_response.content)
                print(f"EXITO: {filename} descargada.")
            else:
                print(f"ERROR: No se pudo descargar {filename}. Código HTTP {img_response.status_code}")
        else:
            print(f"ADVERTENCIA: No se encontraron resultados para: {query}")
    except Exception as e:
        print(f"EXCEPCION procesando {filename}: {e}")

consultas = {
    # RAZAS
    "mazorca raza de maiz arrocillo tlaxcala": "foto-raza-arrocillo.jpg",
    "mazorca raza de maiz azul conabio": "foto-raza-azul.jpg",
    "mazorca raza cacahuacintle maiz": "foto-raza-cacahuacintle.jpg",
    "mazorca raza chalqueno maiz": "foto-raza-chalqueno.jpg",
    "mazorca raza chalqueno bolita": "foto-raza-chalqueno-bolita.jpg",
    "mazorca raza chalqueno cacahuacintle": "foto-raza-chalqueno-cacahuacintle.jpg",
    "mazorca raza chalqueno conico": "foto-raza-chalqueno-conico.jpg",
    "mazorcas raza conico maiz": "foto-raza-conico.jpg",
    "mazorca raza conico bolita": "foto-raza-conico-bolita.jpg",
    "mazorca raza conico cacahuacintle": "foto-raza-conico-cacahuacintle.jpg",
    "mazorca raza conico chalqueno": "foto-raza-conico-chalqueno.jpg",
    "mazorca raza conico elotes conicos": "foto-raza-conico-elotes-conicos.jpg",
    "mazorca raza conico pepitilla": "foto-raza-conico-pepitilla.jpg",
    "mazorca raza elotes conicos maiz": "foto-raza-elotes-conicos.jpg",
    "mazorca raza negro maiz": "foto-raza-negro.jpg",
    "mazorca raza tunicata maiz": "foto-raza-tunicata.jpg",
    
    # COLORES
    "maiz color amarillo mazorca": "foto-color-amarillo.jpg",
    "maiz color azul mazorca entera": "foto-color-azul.jpg",
    "maiz color blanco mazorca": "foto-color-blanco.jpg",
    "maiz color crema mazorca": "foto-color-crema.jpg",
    "maiz color jaspe mazorca pinto": "foto-color-jaspe.jpg",
    "maiz color morado mazorca entera": "foto-color-morado.jpg",
    "maiz color naranja mazorca entera": "foto-color-naranja.jpg",
    "maiz color negro mazorca": "foto-color-negro.jpg",
    "maiz color ocre mazorca": "foto-color-ocre.jpg",
    "maiz color pinto mazorca": "foto-color-pinto.jpg",
    "maiz color rojo mazorca": "foto-color-rojo.jpg",
    "maiz color tinto mazorca": "foto-color-tinto.jpg",
}

print("Iniciando descarga automatizada (Hack sin API Key)...")
for query, filename in consultas.items():
    buscar_y_descargar(query, filename)
print("¡Descarga de imagenes finalizada!")
