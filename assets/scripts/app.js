//main content
const body = document.querySelector('body');
const content = document.querySelector('.content');
const searchInput = document.querySelector('.search input');
const search = document.querySelector('.search button');
const weatherInformation = document.querySelector('.information');
const weatherDetails = document.querySelector('.details');

//secondary content
const image = document.querySelector('.information img');
const temperature = document.querySelector('.temperature');
const weatherType = document.querySelector('.weather-type');
const maxTemp = document.querySelector('.max');
const minTemp = document.querySelector('.min');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

//api
const apiKey = '44848df7386a246f125b780686932d52';
let lon, lat;

function getLonLat() { //Function to get LON and LAT from OpenWeather API
    const city = document.querySelector('.search input').value;
    const lonLatUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    
    return fetch(lonLatUrl).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(json => {
        console.log(json);
        lon = parseFloat(json[0].lon);
        lat = parseFloat(json[0].lat);
        errorMessage();
    }).catch((error) => {
        console.log(`Fetch error: ${error}`);
        errorMessage(searchInput.value);
        /*alert('Cidade inválida.');
         image.src = './assets/images/not found.jpg';
         temperature.innerHTML = 'Não encontrado';*/
    });
}

function loadWeatherData() {
    showLoader();
        getLonLat().then(() => {
            const weatherDataURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            return fetch(weatherDataURL).then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            }).then(json => {
                console.log(json);

                getWeatherType(json.weather[0].main);

                const windSpeedInKm = (json.wind.speed) * 3.6;

                temperature.innerHTML = `${parseInt(json.main.temp)}<span>ºC</span>`;
                maxTemp.innerHTML = `Max: ${parseInt(json.main.temp_max)}<span>ºC</span>`;
                minTemp.innerHTML = `Min: ${parseInt(json.main.temp_min)}<span>ºC</span>`;
                wind.innerHTML = `Vento: ${windSpeedInKm.toFixed(1)} KM/H`;
                humidity.innerHTML = `Humidade: ${json.main.humidity}%`;

                weatherInformationAnimation();
                hideLoader();

            }).catch((error) => {
                console.log(`Fetch error: ${error}`);

                weatherInformationAnimation();
                hideLoader();

            });
        })
}

function weatherInformationAnimation() {
    content.style.height = '487px';
    weatherInformation.classList.add('fade-in');
    weatherDetails.classList.add('fade-in');
    weatherInformation.style.display = 'flex';
    document.querySelector('.search').style.marginBottom = '0rem';
}

function errorMessage(error) {
    const errorContainer = document.querySelector('.error-message');
       if(error === ''){
            errorContainer.style.display = 'flex'; 
            image.src = './assets/images/not found.jpg';
            temperature.innerHTML = 'Não encontrado';
       } else {
        errorContainer.style.display = 'none';
       }
}

function getWeatherType(json) {
    switch (json) {
        case 'Clear':
            image.src = './assets/images/sunny.webp';
            weatherType.innerHTML = 'Ensolarado';
            bodyColor('#87CEEB');
            break;

        case 'Clouds':
            image.src = './assets/images/cloudy.webp';
            weatherType.innerHTML = 'Com nuvens';
            bodyColor('#B8B8B8');
            break;
        
        case 'Rain':
        case 'Drizzle':
            image.src = './assets/images/rainy.webp';
            weatherType.innerHTML = 'Chuva';
            bodyColor('#646464');
            break;
        
        case 'Snow':
            image.src = './assets/images/snow.webp';
            weatherType.innerHTML = 'Neve';
            bodyColor('#D3D3D3');
            break;

        case 'Haze':
            image.src = './assets/images/haze.png';
            weatherType.innerHTML = 'Névoa';
            bodyColor('#B3B3B3');
            break;
        
        case 'Thunderstorm':
            image.src = './assets/images/thunderstorm.webp';
            weatherType.innerHTML = 'Tempestade';
            bodyColor('#434343');
            break;

        default:
            image.src = './assets/images/not found.jpg';
    }
}

function bodyColor(color) {
    body.style.backgroundColor = color;
    body.style.transition = "1.2s ease-out"; 
}

function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
}

search.addEventListener('click', loadWeatherData);

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        loadWeatherData();
    }
});
