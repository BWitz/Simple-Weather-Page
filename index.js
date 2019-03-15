window.addEventListener('DOMContentLoaded', () => {
    this.getUserLocation();
})

getUserLocation = () => {
    let long;
    let lat;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const proxy = `https://cors-anywhere.herokuapp.com/`
            const api = `${proxy}https://api.darksky.net/forecast/eb71c14bc64ff622d7d592881b708917/${lat},${long}`
            this.getLocalWeather(api);
        });
    } else {
        console.alert('Cannot grab user location! Location permissions needed.')
    }
}

getLocalWeather = url => {
    fetch(url)
    .then(res => res.json())
    .then(data => this.updateDOMValues(data))
}

updateDOMValues = weatherObj => {
   const currentWeather = weatherObj.currently;
   const location = this.updateLocationSyntax(weatherObj);
   document.querySelector('.location-timezone').textContent = location;
   document.querySelector('.temperature-degree').textContent = `Currently ${currentWeather.temperature}°`;
   document.querySelector('.temperature-description').textContent = `${currentWeather.summary}`;
   setIcons(currentWeather.icon, document.querySelector('.icon'))
}

updateLocationSyntax = weatherObj => {
   const currentWeather = weatherObj.currently;
   let refactoredLocation = []
   let locationFetch = weatherObj.timezone;
   let locationWithoutSlash = locationFetch.split("/")
   let country = locationWithoutSlash[0];  
   let cityWithoutUnderscores = locationWithoutSlash[1].split("_").join(" ")
   refactoredLocation.push(country, cityWithoutUnderscores);
   let location = refactoredLocation.join(", ");
   return location;
}

setIcons = (icon, iconID) => {
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}