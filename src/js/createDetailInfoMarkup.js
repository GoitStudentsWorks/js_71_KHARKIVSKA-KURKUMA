import { refs } from './refs';
import notAvailablePoster from '../images/poster-not-available.jpg';
import { getMovieTrailer } from './fetchMovies';

function genresDetail(array) {
  return array.map(genre => genre.name).join(', ');
}

export function clearModal(movie) {
  refs.movieModalContainer.innerHTML = '';
}

function changeModalBackgroundColor(rating) {
  const currentElement = document.querySelector('.params__vote')
  if (rating > 1 && rating < 5) {
    currentElement.classList.add("red");
  }
  if (rating > 5 && rating < 8) {
    currentElement.classList.add("yellow");
  }
   if (rating >= 8) {
     currentElement.classList.add("green");
  }
}

function cutOriginalTitleMobile(title) {
  const text = document.querySelector('.params__text-font');
  const newTitle = title.length >= 20 ? title.slice(0, 20) + '...' : title;
  text.textContent = `${newTitle}`;
}

function createDetailMovieMarkUp(movie) {
  if (!movie) {
    return '';
  }
  
  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : notAvailablePoster;

  const markup = `
      <div class="modal-wrap">
        <img
            class="modal-img"
            src="${posterSrc}"
            alt="${movie.original_title}" 
        />
        
        <div class="params">
          <h2 class="params__title">${movie.original_title}</h2>
          <div class="params__wrap">
            <div class="params__key">
              <p class="params__key__text">Vote/Votes</p>
              <p class="params__key__text">Popularity</p>
              <p class="params__key__text">Original Title</p>
              <p class="params__key__text">Genre</p>
            </div>

            <div class="params__value">
              <p class="">
                <span class="params__vote">${movie.vote_average.toFixed(2)} </span> 
                <span class="params__slash">/</span>
                <span class="params__vote_count">${movie.vote_count}</span></p>
              <p class="params__popularity">${movie.popularity.toFixed(1)}</p>
              <p class="params__text-font">${movie.original_title}</p>
              <p class="params__text-font">${genresDetail(movie.genres)}</p>
            </div>
          </div>
        
          <div class="about">
            <h3 class="about__title">About</h2>
            <p class="about__overview">${movie.overview}</p>
          </div>
          <div class="modal-buttons">
            <button class="modal-buttons__watched add-to-watched-btn" data-modal-watched>add to Watched</button>
            <button class="modal-buttons__queue add-to-queue-btn" data-modal-watched>add to queue</button>
          </div>
        </div>
      </div>`;
  refs.movieModalContainer.innerHTML = markup;
  changeModalBackgroundColor(movie.vote_average);
  cutOriginalTitleMobile(movie.original_title);
}

export { createDetailMovieMarkUp };

export async function showtTrailer(id) {
  const data = await getMovieTrailer(id)
    .then(({ results }) =>
      results.map(item => {
        if (item.site === 'YouTube') {
          return `https://www.youtube.com/embed/${item.key}`;
        }
      })
    )
    .catch(err => console.log(err));
  
  if (data[0] === '' || typeof(data[0]) === 'undefined') {
    const trailerErrorMessage = `
      <div class="trailer-message"> 
        <h3> sorry, there is no trailer for this movie <h3>
      </div>`
    refs.movieModalContainer.insertAdjacentHTML('beforeend', trailerErrorMessage);
    return;
  }
  const urlTrailer = data[0];
  markupTrailer(urlTrailer);
}
function markupTrailer(url) {
  const trailerMobileMarkup = `
          <button class="modal-buttons__watched button-trailer">
            <a
              href="${url}?rel=0&showinfo=0&autoplay=0" 
              class="decoration"
              target="_blank" 
              rel="noreferrer noopener"
            >Watch a trailer
            </a>
          </button>`;
  
  refs.movieModalContainer.insertAdjacentHTML('beforeend', trailerMobileMarkup);

  const trailerTabletMarkup = `
          <div class="trailer-wrapper">
            <iframe 
              width="650" 
              height="400"
              class="trailer__video"
              src="${url}?rel=0&showinfo=0&autoplay=0"
              frameborder="0" 
              loading="lazy"
            </iframe>
        </div>`;
  refs.movieModalContainer.insertAdjacentHTML('afterend', trailerTabletMarkup);
}
