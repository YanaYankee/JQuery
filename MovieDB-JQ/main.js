	//--------------------------------------------- Storage Object -----------------------------
var s = {
    url: "https://api.themoviedb.org/3/",
    imgUrl: "https://image.tmdb.org/t/p/w500/",
    key: '?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=',
	curLang: "en-US",
	curAPI: "",
    articleList: [],
    total_pages: '',
    current_page: 1,
	index: (this.current_page-1)*20+1,
    articleListLength: '',
    limit: 10,
    movieList: [],
    movieIdClicked: '',
    movieItem: {},
    list : document.getElementById('listM'),
    movieBackground: document.getElementById('movieBackground'),
};


	//--------------------------------------------- GET DATA FUNCTION -----------------------------
	function getData(apiName, config, render, error) {
		$.ajax({
			url: s.url + apiName + s.key +s.curLang  + config,
			dataType: "json",
			success: render,
			error: error
		});
	}

//-----------------------------------------  EVENTS
	$(window).on('load', function (e) {
		$('#movieBackground').hide();
			// Mivie List call
			getArticleList();
	});


	$(window).on('scroll', function() {
			  var d = document.documentElement;
			  var offset = d.scrollTop + window.innerHeight;
			  var height = d.offsetHeight;

			 //console.log('offset = ' + offset);
				//console.log('height = ' + height);		
				
					if (offset === height) {									
						s.current_page++
						console.log(s.current_page)		
						if (s.current_page < s.limit) {	
							getArticleList ()								
							}						
						}	
					
	});
	
	$(document).on("click", ".curLang", (function() {						
						
						clearSearch("searchList");
						clearSearchValue("searchMovie");
						if(s.curLang == "en-US"){							
							s.curLang = "ru-RU" ;							
							console.log(s.curLang);
						}
						else {
							s.curLang = "en-US";
							console.log(s.curLang)
							}
						
						if(s.curAPI=="Grid"){
							$('#listM').empty();							
							s.articleList=[];
							getData("movie/top_rated", '&page=' + s.current_page, toStorage , error);
						}
						
						else {							
							getData("movie/"+s.movieIdClicked, "", movieToStorage , error); }
						}) );	
	
	
	
	$(document).on("click", ".moreInfo", (function() {
						s.movieIdClicked = this.id;
						clearSearch("searchList");
						clearSearchValue("searchMovie");
						console.log(s.movieIdClicked)	;			 
						//console.log(s.movieItem)
						}) );	
	$(document).on("click", ".moreInfo", function (e) {
		$('#listM').hide();
		
		$('#movieBackground').show();
			// Mivie List call
		getData("movie/"+s.movieIdClicked, "", movieToStorage , error); //API request for movie list 	
		s.curAPI="Grid";
		
	//	https://api.themoviedb.org/3/movie/372058?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US
	});
	
	
	$(document).on("click", "#backBtn", (function() {
		$('#movieBackground').hide();
		$('#listM').show();
			// Mivie List call
			getArticleList();
	}));
	
	
	

//-----------------------------------------  GRID
	
	function getArticleList () {
		getData("movie/top_rated", '&page=' + s.current_page, toStorage , error); //API request for movie list 	
s.curAPI="Grid";		
	}
		
	
	function toStorage(result, status, xhr) {			
		
		s.articleList = s.articleList.concat( result["results"].slice(s.index)); // add new object to existing array	
		s.total_pages =  result["total_pages"];		
		s.articleListLength = s.articleList.length;		
		ArticalList();		
	}

function movieToStorage(result, status, xhr) {			
		
		s.movieItem = result; // add new object to existing array	
		console.log(s.movieItem)	
		moviePage();		
	}
	function ArticalList () {
		//--------------------------  Infinite scroll  > render() while limit allows
	
		var resultHtml = $("<div class=\"row\"  id=\"articleList\">");
				
		
        for (var i = 0; i < s.articleList.length; i++) {
			 
            var image = s.articleList[i]["poster_path"] == null ? "Image/no-image.png" : s.imgUrl + s.articleList[i]["poster_path"];
            var cutString =  s.articleList[i].overview.slice(0,200);
            s.articleList[i].overview  = cutString.slice(0, cutString.lastIndexOf('.'))+'.';
            resultHtml.append("<div class=\"result col-12 col-sm-12 col-md-9 col-lg-3\" resourceId=\"" + s.articleList[i]["id"] + "\">"
                + "<div class=\"card movie-card\">"
					+"<div class=\"rowMovieDiv row no-gutters\">"
						+ "<div class=\"imgDiv\">"
							+ "<img class=\"poster\" src=\"" + image + "\" />"
							+ "<div class=\"overlayPoster\">"
							+ "<div class=\"card-body\">"
								+ "<h4 class=\"card-title\">" + s.articleList[i]["title"] + "</h4>"
								+ "<p class=\"card-text\">" + s.articleList[i]["overview"] + "</p>"
								+ "<p class=\"card-footer\"><button  class=\"moreInfo\" id=\"" + s.articleList[i]["id"] + "\">More info</button></p>"
								+ "</div>"
							+ "</div>"
						+ "</div>"
					+ "</div>"
                + "</div>"
            )
		resultHtml.append("</div>");
        $("#listM").html(resultHtml);
		
		
		}
			console.log(s.curAPI);
		
        }
		
		// ------------------------------------------ STATUS ERROR FUNCTION -----------------------------------------------------------------
function error(xhr, status, error) {
    $("#listM").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
}

   // ------------------------------------------ RENDER SEARCH LIST FUNCTION -----------------------------------------------------------------

	$(document).on('keyup paste', "input", function () {
		
        var input = document.getElementById('searchMovie');
		clearSearch('searchList');
		if (input.value!="") {
        getData("search/movie", "&page=1&include_adult=false&query=" + input.value, searchToStorage, noInput);                  //  call search render
		s.curAPI="About";
		}
	});

	function noInput () {
		clearSearch('searchList');
	}	
	
		$(document).on("click", ".searchRes", (function() {
						s.movieIdClicked = this.id;
						console.log(s.movieIdClicked);
						}) );	
						
		$(document).on("click", ".searchRes", (function() {
						
							
							$("#listM").hide();		
							$("#movieBackground").show();						
											
						}) );						
						
		$(document).on("click", ".searchRes", function (e) {
		
			// Mivie List call
		getData("movie/"+s.movieIdClicked, "", movieToStorage , error); //API request for movie list 	
		s.curAPI="About";
		
	//	https://api.themoviedb.org/3/movie/372058?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US
	});

	
function searchToStorage(result, status, xhr) {		
    s.movieList = result["results"];
    console.log(s);
    renderSearch()
}
    
function renderSearch() {
	
    var searchResult = $("<div class=\"MovieList\">");

    for (var i = 0; i < s.movieList.length; i++) {
        searchResult.append("<div class=\"col-12 col-sm-12 col-md-8 input-group \" >"
		+ "<a class=\"moreInfo\" id=\""+ s.movieList[i]["id"] + "\">" + s.movieList[i]["title"] + "</a></div>")
      
    }
    searchResult.append("</div>");
    $("#searchList").html(searchResult);
	
	
}
function clearSearch(el){
    document.getElementById(el).innerHTML = "";
};

function clearSearchValue(el){
    document.getElementById(el).value = "";
};
//-----------------------------------------  PAGE 



function moviePage(){   			
			 
            var imageMovie = s.imgUrl + s.movieItem["poster_path"];
            var backgroundImage = s.movieItem["backdrop_path"];
			s.movieBackground.style.display = 'block';
			s.movieBackground.style.background = `url('https://image.tmdb.org/t/p/w500${backgroundImage}') no-repeat`;
			s.movieBackground.style.backgroundSize = "cover"; 
            var resultHtml = (
			"<div class=\"container\">" 
				+ "<div class=\"row\" id=\"movie\">"			
					+ "<div class=\"col-12 col-sm-12 col-md-12 col-lg-12 my-3\">"
						+ "<button id=\"backBtn\" class=\"btn btn-outline-info my-2 my-sm-0\">Back to Movie List</button>"
					+ "</div>"
					+ "<div class=\"col-12 col-sm-4 col-md-4 col-lg-5 col-xl-4\">"
						+"<img class=\"imgAboutSrc\" src=\"" + imageMovie + "\">"
					+ "</div>"
			   + "<div class=\"col-12 col-sm-8 col-md-8 col-lg-7 col-xl-8 d-flex flex-column \">"
					+ "<h4 class=\"card-title\">" + s.movieItem["title"] + "</h4>"
					+ "<div>"
					+ "<div class = \"rating\"><svg class=\"score\" viewBox=\"-25 -25 450 400\">"
					+ " <circle class=\"score-empty\"  cx=\"175\" cy=\"175\" r=\"175\"> </circle>"
					+ "<circle id=\"js-circle\" class=\"js-circle score-circle\" transform=\"rotate(-90 175 175)\" cx=\"175\" cy=\"175\" r=\"175\" style=\"stroke-dashoffset: 33;\"></circle>"					
					+ "<text id = \"score-rating\" class=\"js-text score-text\" x=\"49%\" y=\"51%\" dx=\"-25\" text-anchor=\"middle\"></text></svg></div>"
					
					+ "<div class='ratingText'>Рейтинг пользователя</div>"
					+"</div>"
					+ "<p class=\"card-text\">" + s.movieItem["overview"] + "</p>"               
					+"</div>"
				+"</div>"
			+"</div>"
            )
        $("#aboutMovie").html(resultHtml);
		
	////----------------------------------------- Circle radius, diameter and offset function	
    var button = document.querySelector("js-button");
    var circle = document.getElementById("js-circle");
    var text 	= document.getElementById("score-rating");
    var radius = circle.getAttribute("r");
    var diameter = Math.round(Math.PI * radius * 2);
    var getOffset = (val = 0) => Math.round((100 - val) / 100 * diameter);
		
		
		var val = s.movieItem.vote_average*10;
			console.log(val);
		
		var roundRating = document.getElementById("score-rating");
			roundRating.innerText =  s.movieItem["vote_average"]*10 + '%';
			
			var run = () => {
				circle.style.strokeDashoffset = getOffset(val);
				text.textContent = `${val}%`
			};
			run();
}

 






