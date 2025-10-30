# API EXTERNA SPOTIFY
nombre: Spotify

**URL de la API**: https://api.spotify.com/v1  
**URL del portal**: https://developer.spotify.com

## Endpoints relevantes
Los endpoints relevantes que utilizaremos serán los correspondientes a los **álbumes y canciones** que el usuario busque a través de la navegación, ahí podrá seleccionar la opción que necesita a través de un botón y este lo mandara directamente a la página o aplicación de Spotify con la canción o álbum que había buscado

URL seleccionado del album: https://api.spotify.com/v1/albums/{id}

### ejemplo de respuesta:     
{
  “nombre”: “String”,     
  "album_type": "compilation",  
  "total_tracks": “int”,  
  “fecha de publicación”: “dia-mes año”,  
  "images": [   
     {       	
     "url":   "URL de la imagen",      
      "height": 300,     
 	    "width": 300    }  
]
  "external_urls": {
  "spotify": "URL correspondiente al album"
  }

URL seleccionado de la cancion: https://api.spotify.com/v1/tracks/{id}
### ejemplo de respuesta:
{  
  "nombre": "String",    
  "autor": "String",
  "fecha de publicación": "dia-mes-año",
  "reproducciones": "int",    
  "href": "string",  
    "id": " id de la cancion",  
    "images": [  
      {    
        "url": "imagen referente a la cancion",  
        "height": 300,  
        "width": 300  
      }  
    ]  

## Explicacion textual
A la hora de realizar una búsqueda a través del navegador de la página, este te mostrará las videos o álbums correspondientes a la búsqueda, el cual estaría mostrando su nombre, autor, fecha de publicación, además de su portada, este al hacer "click" encima te redirigirá a la página de spotify, de la canción o álbum seleccionado.
