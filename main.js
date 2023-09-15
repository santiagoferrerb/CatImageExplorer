
// AXIOS -> Fetch en esteroides
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/'
});
api.defaults.headers.common['X-API-KEY'] = 'live_3MmHsd77Q3VE4uQIw97MdS0GDGIPZkK6QecJ5wkfClTorKYOy3FBoqphpV8Q1RxJ';



const URL = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_3MmHsd77Q3VE4uQIw97MdS0GDGIPZkK6QecJ5wkfClTorKYOy3FBoqphpV8Q1RxJ';
const URL_FAV = 'https://api.thecatapi.com/v1/favourites';
const URL_DEL_FAV = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_3MmHsd77Q3VE4uQIw97MdS0GDGIPZkK6QecJ5wkfClTorKYOy3FBoqphpV8Q1RxJ`;
const URL_UP = 'https://api.thecatapi.com/v1/images/upload';


// console.time('fetching');
// fetch(URL)
// .then(response => response.json())
// .then(data => {
//     const img = document.querySelector('.imagen');
//     console.log(img);
//     const button = document.querySelector('button');
//     button.addEventListener('click', () => {
//         location.reload();
//     })
//     img.setAttribute('src', data[0].url);
//     });
// console.timeEnd('fetching');


//

const foto = document.querySelectorAll('.imagen');
const errorMsg = document.querySelector('.error');
const imgFavs = document.querySelector('.favs');
const btn = document.querySelector('.reload');
const btnFav = document.querySelectorAll('.fav');


btn.addEventListener('click', () => location.reload());


async function fetchData (urlApi){
    const response = await fetch(urlApi,{
        headers: {
            'X-API-KEY': 'live_3MmHsd77Q3VE4uQIw97MdS0GDGIPZkK6QecJ5wkfClTorKYOy3FBoqphpV8Q1RxJ',
        },
    });
    const data = await response.json();
    return data
};

async function fetchGatos() {
    try{
        const cat = await fetchData(URL);
        console.log('Random');
        console.log(cat);
        let catIndex =0;

        foto.forEach(item => {
            item.src = cat[catIndex].url;
            catIndex++;
        });

        btnFav.forEach(item => item.addEventListener('click',()=> {
             postFavs(cat[(Array.from(btnFav).indexOf(item))].id);
         }));


            // btnFav[0].addEventListener('click',() => postFavs(cat[0].id));
            // btnFav[1].addEventListener('click',() => postFavs(cat[1].id));
            // btnFav[2].addEventListener('click', () => postFavs(cat[2].id));


    } catch (err) {
        console.log(err);
    }
};

async function postFavs(id) {
    try{
        // const response = await fetch(URL_FAV, {
        // method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'X-API-KEY': 'live_3MmHsd77Q3VE4uQIw97MdS0GDGIPZkK6QecJ5wkfClTorKYOy3FBoqphpV8Q1RxJ',
        //         },
        // body: JSON.stringify({
        //     image_id: id
        //     })
        // });
        // console.log(response);
        // fetchFavoritos();

        const res = await api.post('favourites',{
            image_id: id,
        });
        console.log(res);
        fetchFavoritos();

    } catch (err) {
    console.log(err);
    }
}

async function fetchFavoritos() {
    try{
        const favs = await fetchData(URL_FAV);

        console.log('Favoritos');
        console.log(favs);

        console.log();

        const html = favs.map(item => `
        <div class="card">
            <img src= "${item.image.url}"class="gatos-favoritos" alt="gato">
            <button class="btn fav del-fav" > ❌ </button>
        </div>
        `).join('');
        imgFavs.innerHTML = html;

        const btnDel = document.querySelectorAll('.del-fav');

        btnDel.forEach(item => item.addEventListener('click', () => {
            borrarFavs(favs[Array.from(btnDel).indexOf(item)].id);
        }))
    } catch (err) {
        errorMsg.classList.remove('hide');
        console.log(err);

    }
}

async function borrarFavs(id) {
    try{
        const response = await fetch(URL_DEL_FAV(id), {
            method: 'DELETE',
        })
        console.log(response);
        fetchFavoritos();
    } catch (err){
        console.log(err);
    }
}

async function uploadFoto() {
    const form = document.querySelector('.upload-form');
    const formData = new FormData(form);

    console.log(formData.get('file'));
    try{
        const response = await fetch(URL_UP, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'X-API-KEY': 'live_3MmHsd77Q3VE4uQIw97MdS0GDGIPZkK6QecJ5wkfClTorKYOy3FBoqphpV8Q1RxJ',
        },
            body: formData,
        });
        const data = await response.json();
        console.log(data);
        postFavs(data.id);
    } catch (err){

    }
}

fetchGatos();
fetchFavoritos();



