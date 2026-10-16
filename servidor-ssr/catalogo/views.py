from django.shortcuts import render

# Productos de Dulce Yanin (lista en memoria, sin base de datos).
# Estos datos se insertan en el HTML en el servidor, antes de enviarlo al navegador.
PRODUCTOS = [
    {"nombre": "Tres leches", "categoria": "Pasteles completos", "precio": 420},
    {"nombre": "Chocolate húmedo", "categoria": "Pasteles completos", "precio": 450},
    {"nombre": "Red velvet", "categoria": "Pasteles completos", "precio": 480},
    {"nombre": "Zanahoria con nuez", "categoria": "Pasteles completos", "precio": 460},
    {"nombre": "Cheesecake de frutos rojos", "categoria": "Pasteles completos", "precio": 520},
    {"nombre": "Cupcake de vainilla", "categoria": "Postres individuales", "precio": 45},
    {"nombre": "Brownie con nuez", "categoria": "Postres individuales", "precio": 40},
    {"nombre": "Pay de limón", "categoria": "Postres individuales", "precio": 55},
    {"nombre": "Flan napolitano", "categoria": "Postres individuales", "precio": 50},
    {"nombre": "Galleta de chispas", "categoria": "Postres individuales", "precio": 35},
    {"nombre": "Café americano", "categoria": "Bebidas", "precio": 35},
    {"nombre": "Capuchino", "categoria": "Bebidas", "precio": 55},
    {"nombre": "Chocolate caliente", "categoria": "Bebidas", "precio": 50},
    {"nombre": "Frappé de galleta", "categoria": "Bebidas", "precio": 75},
    {"nombre": "Leche con fresa", "categoria": "Bebidas", "precio": 40},
]


def vista_ssr(request):
    # render() toma la plantilla, le mete los productos y devuelve el HTML ya terminado.
    contexto = {"productos": PRODUCTOS}
    return render(request, 'catalogo/catalogo_ssr.html', contexto)