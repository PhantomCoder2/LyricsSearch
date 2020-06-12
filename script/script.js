const search= document.querySelector('#search');
const form = document.querySelector('form');
const result =document.querySelector('.result');
const more = document.querySelector('#more')

const apiURL ='https://api.lyrics.ovh';

//get songs suggestions
async function searchSong(val){
    const res = await fetch(`${apiURL}/suggest/${val}`);
    const data = await res.json();
    // console.log(data);
    showData(data);
}

//show the songs suggestion data in template
//put next and pev button use
function showData(data){
    result.innerHTML = `
      <ul class='songs'>
           ${data.data.
            map(
                song =>  
                `<li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class='btn' data-artist = "${song.artist.name}" data-songTitle= "${song.title}">Get Lyrics</button>
         </li>`   
        ).join('')
        } 
      </ul>
    `;
    if(data.next || data.prev){
        more.innerHTML = `
           ${
               data.prev 
               ?`<button class='btn btn-info'  onclick="getMoreSongs('${data.prev}')">Prev</button>`
               : ''
           }
           ${
               data.next 
               ?`<button class='btn btn-info' onclick="getMoreSongs('${data.next}')">Next</button>`
               :''
           }
        `;
    }else{
        more.innerHTML='';
    }
}
//Next and prev key function
async function getMoreSongs(url){
    const resp = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await resp.json();
    showData(data);
}
//Get the lyrics
async function getLyrics(artist,song){
   const res = await fetch(`${apiURL}/v1/${artist}/${song}`);
   const data= await res.json();
    
   const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
   result.innerHTML = `<h2><strong>${artist}</strong> - ${song}</h2>
     <span>${lyrics}</span>
    `;
    more.innerHTML= '';
}



form.addEventListener('submit', e=>{
   e.preventDefault();

   const searchForm= search.value.trim();
   if(!searchForm){
       alert('Please Enter the song name or artist');
   }else{
       searchSong(searchForm);
   }
});

result.addEventListener('click', e=>{
   console.log(e.target);
   if(e.target.tagName === 'BUTTON'){
       const artist = e.target.getAttribute('data-artist');
       const song = e.target.getAttribute('data-songTitle');
       getLyrics(artist,song);
   }
});