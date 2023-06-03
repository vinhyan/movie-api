page = 1;
perPage = 10;
loadMovieData = (title = null) => {
  console.log(`[DEBUG] title: ${title}`);

  const pagination = document.querySelector('.pagination');
  //console.log(pagination);

  // if title is NOT NULL, set page = 1 and HIDE pagination
  if (title) {
    page = 1;
    pagination.classList.add('d-none');
  } else {
    // SHOW pagination
    pagination.classList.remove('d-none');
  }

  //Fetch data
  // if (title) page = 1;
  const url = `https://zany-wig-toad.cyclic.app/api/movies?page=${page}&perPage=${perPage}${
    title ? `&title=${title}` : ''
  }`;
  console.log(`[DEBUG] url: ${url}`);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(`[DEBUG]`);
      console.log(data);
      // Create <tr>
      const movieRows = ` ${data
        .map((movie) => {
          return `<tr data-id=${movie._id}>
              <td>${movie.year}</td>
              <td>${movie.title}</td>
              <td>${movie.plot ? movie.plot : 'N/A'}</td>
              <td>${movie.rated ? movie.rated : 'N/A'}</td>
              <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60)
            .toString()
            .padStart(2, '0')}</td>
              </tr>
              `;
        })
        .join('')}`;

      // Add movieRows to the movies table
      document.querySelector('#moviesTable tbody').innerHTML = movieRows;

      // Update current page number
      const currPage = document.querySelector('#current-page');
      currPage.innerText = page;

      // Make each movie row clickable to view details modal
      document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
        row.addEventListener('click', (e) => {
          let clickedId = row.getAttribute('data-id');
          console.log(clickedId);

          // Get movie details by movieID
          fetch(`https://zany-wig-toad.cyclic.app/api/movies/${clickedId}`)
            .then((res) => res.json())
            .then((data) => {
              document.querySelector('.modal-title').innerText = data.title;

              const movieDetail = `${
                data.poster
                  ? `<img class="img-fluid w-100" src=${data.poster}>`
                  : ''
              }<br><br>
                <strong>Directed By:</strong> ${data.directors.join(
                  ', '
                )}<br><br>
                <p>${data.fullplot}</p>
                <strong>Cast:</strong> ${
                  data.cast ? data.cast.join(', ') : ' N/A'
                }<br><br>
                <strong>Awards:</strong> ${data.awards.text}<br>
                <strong>IMDB Rating:</strong> ${data.imdb.rating} (${
                data.imdb.votes
              } votes)
                `;

              document.querySelector('#detailsModal .modal-body').innerHTML =
                movieDetail;

              let modal = new bootstrap.Modal(
                document.getElementById('detailsModal')
              );

              modal.show();
            })
            .catch((err) => console.log(err));
        });
      });
    })
    .catch((err) => console.log(err));
};

//Execute when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadMovieData();
  
  document.querySelector('#previous-page').addEventListener('click', (e) => {
    if (page > 1) page--;
    loadMovieData();
  });

  document.querySelector('#next-page').addEventListener('click', (e) => {
    page++;
    loadMovieData();
  });

  document.querySelector('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    console.log(title);
    loadMovieData(title);
  });

  document.querySelector('#clearForm').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#title').value = '';
    loadMovieData();
  });
});
