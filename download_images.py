from googleapiclient.discovery import build
import requests
import os

api_key = "AIzaSyBCnOi6RIBpT8gtVmeGmRZJ1egadh7PZUw"
cse_id = "554a9f79f820d4d73"
imagenes_dir = r"d:\PAGINA MAIZ\imagenes"

if not os.path.exists(imagenes_dir):
    os.makedirs(imagenes_dir)

def buscar_y_descargar(query, filename):
    filepath = os.path.join(imagenes_dir, filename)
    if os.path.exists(filepath):
        print(f"Ya existe {filename}, saltando...")
        return

    try:
        service = build("customsearch", "v1", developerKey=api_key)
        res = service.cse().list(q=query, cx=cse_id, searchType="image", num=1).execute()
        
        if 'items' in res:
            url = res['items'][0]['link']
            # Algunos links pueden requerir headers
            headers = {'User-Agent': 'Mozilla/5.0'}
            img_response = requests.get(url, headers=headers, timeout=10)
            if img_response.status_code == 200:
                with open(filepath, 'wb') as handler:
                    handler.write(img_response.content)
                print(f"{filename} descargada con éxito.")
            else:
                print(f"Error {img_response.status_code} descargando {filename} desde {url}")
        else:
            print(f"No se encontraron resultados para: {query}")
    except Exception as e:
        print(f"Error procesando {filename}: {e}")

consultas = {
    "mazorca raza arrocillo site:conabio.gob.mx": "foto-raza-arrocillo.jpg",
    "mazorca raza azul site:conabio.gob.mx": "foto-raza-azul.jpg",
    "mazorca raza cacahuacintle site:conabio.gob.mx": "foto-raza-cacahuacintle.jpg",
    "mazorca mazorcas raza chalqueno site:conabio.gob.mx": "foto-raza-chalqueno.jpg",
    "mazorca raza chalqueno bolita site:conabio.gob.mx": "foto-raza-chalqueno-bolita.jpg",
    "mazorca raza chalqueno cacahuacintle site:conabio.gob.mx": "foto-raza-chalqueno-cacahuacintle.jpg",
    "mazorca raza chalqueno conico site:conabio.gob.mx": "foto-raza-chalqueno-conico.jpg",
    "mazorca raza conico site:conabio.gob.mx": "foto-raza-conico.jpg",
    "mazorca raza conico bolita site:conabio.gob.mx": "foto-raza-conico-bolita.jpg",
    "mazorca raza conico cacahuacintle site:conabio.gob.mx": "foto-raza-conico-cacahuacintle.jpg",
    "mazorca raza conico chalqueno site:conabio.gob.mx": "foto-raza-conico-chalqueno.jpg",
    "mazorca raza conico elotes conicos site:conabio.gob.mx": "foto-raza-conico-elotes-conicos.jpg",
    "mazorca raza conico pepitilla site:conabio.gob.mx": "foto-raza-conico-pepitilla.jpg",
    "mazorca raza elotes conicos site:conabio.gob.mx": "foto-raza-elotes-conicos.jpg",
    "mazorca raza negro site:conabio.gob.mx": "foto-raza-negro.jpg",
    "mazorca raza tunicata site:conabio.gob.mx": "foto-raza-tunicata.jpg",
    "maiz color amarillo grano site:conabio.gob.mx": "foto-color-amarillo.jpg",
    "maiz color azul grano site:conabio.gob.mx": "foto-color-azul.jpg",
    "maiz color blanco grano site:conabio.gob.mx": "foto-color-blanco.jpg",
    "maiz color crema grano site:conabio.gob.mx": "foto-color-crema.jpg",
    "maiz color jaspe grano site:conabio.gob.mx": "foto-color-jaspe.jpg",
    "maiz color morado grano site:conabio.gob.mx": "foto-color-morado.jpg",
    "maiz color naranja grano site:conabio.gob.mx": "foto-color-naranja.jpg",
    "maiz color negro grano site:conabio.gob.mx": "foto-color-negro.jpg",
    "maiz color ocre grano site:conabio.gob.mx": "foto-color-ocre.jpg",
    "maiz color pinto grano site:conabio.gob.mx": "foto-color-pinto.jpg",
    "maiz color rojo grano site:conabio.gob.mx": "foto-color-rojo.jpg",
    "maiz color tinto grano site:conabio.gob.mx": "foto-color-tinto.jpg",
}

for query, filename in consultas.items():
    buscar_y_descargar(query, filename)
