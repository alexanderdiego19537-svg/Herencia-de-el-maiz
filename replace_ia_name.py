import glob

# Apuntamos a la carpeta principal o raíz de todo el ecosistema web
directory = "d:/PAGINA MAIZ"
# Extraemos rápidamente una lista masiva de todas las páginas web HTML del proyecto
html_files = glob.glob(f"{directory}/**/*.html", recursive=True)

for filepath in html_files:
    # Abrimos cada archivo y leemos su código en español (formato utf-8 para tildes)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Este pequeño robot de automatización tiene un solo objetivo noble:
    # Aplicar mayúsculas y formato correcto al nombre de nuestra deidad y al mismo tiempo IA,
    # para que visualmente se lea mucho más imponente, profesional y culturalmente respetuoso.
    new_content = content.replace("ñu´mu tu ia", "IA ñu'mu")
    
    # Si el robot encontró el nombre viejo y lo corrigió, guardamos los cambios de forma permantente
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"¡Nombre de la Inteligencia Artificial corregido y embellecido en: {filepath}!")
