let lastSearchbarKeystroke;

function movieSearch () {
	lastSearchbarKeystroke = Date.now();
	setTimeout(() => {
		if (Date.now() < lastSearchbarKeystroke + 750) {
			return;
		}
		const search = $("#movieSearch").val();
		const loader = $(".loader");
		if (search.length > 0) {
			loader.css("display", "block");
			$.get("/movie/search", {search}, (data) => {
				let results = $("#movieSearchResults");
				results.empty();
				let html = '<div class="row">';
				for (let i = 0; i < Math.min(4, data.length); i++) {
					let movie = data[i];
					html += '<div class="col-12 col-md-6 col-lg-3 movie-card"><div class="card">';
					html += movie.poster !== "N/A" ? '<img class="card-img-top" src="' + movie.poster + '" alt="' + movie.title + '">' : '';
					html += '<div class="card-body"><p class="card-text">';
					html += '<strong>' + movie.title + '</strong><br>';
					html += movie.year + ', ' + movie.runtime + ' min<br>';
					html += '<a class="btn btn-primary btn-block" href="movie/mark-watched/' + movie.imdbId + '">Watched</a>';
					html += '</p></div></div></div>';
				}
				loader.css("display", "none");
				results.append(html);
			}).fail((error) => {
				$("#movieSearchResults").html("<strong>An error happened: " + error.responseText + ". Please retry your search.</strong>");
				loader.css("display", "none");
			});
		} else {
			$("#movieSearchResults").empty();
		}
	}, 750);
}

$("#changeDateModal").on("show.bs.modal", function (event) {
	const button = $(event.relatedTarget);
	const imdbId = button.data("movie-imdb-id");
	const title = button.data("movie-title");
	const watchedDate = button.data("watched-date");
	let modal = $(this);
	modal.find("#movieTitle").html(title);
	modal.find("#date").val(watchedDate);
	modal.find("#imdbId").val(imdbId);
});

function changeWatchDate () {
	const date = $("#date").val();
	const imdbId = $("#imdbId").val();
	$.ajax({
		type: "PUT",
		dataType: "json",
		url: "/movie/change-watched-date",
		data: {
			imdbId: imdbId,
			watchedDate: date
		}
	}).done(function (data) {
		location.reload();
	});
	$("#changeDateModal").modal("hide");
}