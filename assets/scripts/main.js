const tmdbBaseUrl = "https://api.themoviedb.org/3";

function getTime(id, i) {
    let url = tmdbBaseUrl + "/tv/" + id +
        '?api_key=c3b10b85e7b9f342239ab6fd3a6fea88&language=en-US';
    let meta = document.getElementById('content' + i).getElementsByClassName('meta')[0];

    fetch(url)
    .then(response => response.json())
    .then(response => {
            no_of_episodes = response.number_of_episodes;
            episode_run_time = response.episode_run_time;
            vote_avg = response.vote_average;
            vote_count = response.vote_count;

            avg_episode_run_time = 0;
            for(let i=0; i < episode_run_time.length; ++i)
                avg_episode_run_time += episode_run_time[i];

            avg_episode_run_time /= episode_run_time.length;
            hours_required = Math.ceil(avg_episode_run_time * no_of_episodes / 60);

            meta.innerHTML = "Time: <span> <span class='text-offset'>" + hours_required + "</span> Hrs </span>"
                + "<br>Votes: <span> <span class='text-offset'>" + vote_avg + "</span> (" + vote_count + ") </span>";
    });
}

function getShows() {
    const seriesName = document.getElementsByName("seriesName")[0].value;
    if (!seriesName) {
        console.log("Series name required!");
        return;
    }
    let nameApiUrl = tmdbBaseUrl + "/search/tv" +
        "?api_key=c3b10b85e7b9f342239ab6fd3a6fea88&language=en-US&page=1&query="
        + seriesName;

    let resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = "";

    fetch(nameApiUrl)
    .then(response => response.json())
    .then(response => {
        for(let i = 0; i < response.total_results; ++i) {
            let show = document.createElement('div');
            show.setAttribute('class', 'show');
            show.innerHTML = "<div id='content"
                + i + "' class='series-content'><div class='series-name'>"
                + response.results[i].name
                + "</div> <div class='meta'></div> <p class='series-overview'>"
                + response.results[i].overview
                + '</p></div>';

            resultsContainer.appendChild(show);

            let posterPath = response.results[i].poster_path;
            let imageUrl = 'http://image.tmdb.org/t/p/w500' + posterPath;
            let imageContainer = document.createElement('div');
            let image = document.createElement('img');
            imageContainer.setAttribute('class', 'image-container');
            imageContainer.appendChild(image);
            if (posterPath) {
                image.setAttribute('src', imageUrl);
            }
            image.setAttribute('class', 'series-image');
            show.appendChild(imageContainer);

            getTime(response.results[i].id, i);
        }
    });
}
