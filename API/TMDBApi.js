// API/TMDBApi.js

const API_TOKEN = "b5664d3374edb635cc02951c64bcd870";

export function getFilmsFromApiWithSearchedText (text, page) {
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_TOKEN + '&language=fr&query=' + text + '&page=' + page
    return fetch(url)
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

// fetch : librairie JS déja incluse dans notre appli. 2 option : then = succès, elle convertit la réponse de notre API en JSON 
//catch = erreur 

export function getImageFromApi(name) {
    return 'https://image.tmdb.org/t/p/w300' + name
}

