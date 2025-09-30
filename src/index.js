import "./style.css";
import apiRequest from "./dom.js";
let unit;
const searchButton=document.querySelector("#searchButton");
const mainContainer=document.querySelector("#mainContainer")
const locationNameContainer=document.querySelector("#locationName")
const todayImg=document.querySelector("#todayImg")
const todayTemp=document.querySelector("#todayTemp");
const additionalInfoContainer=document.querySelector("#additionalInfoContainer");
const cardsContainer=document.querySelector("#cardsContainer");
const locationInput=document.querySelector("#locationInput");
const errorDisplay = document.querySelector("#errorDisplay"); 
const toggleUnit=document.querySelector("#toggleUnit");
searchButton.addEventListener("click",()=>{
    if(locationInput.value!=""){
        renderPage(locationInput.value);
    }
});

toggleUnit.addEventListener("click",setUnit);

async function renderPage(s){
    errorDisplay.classList.add("hide");
    startLoading();
    let result= await apiRequest(s,unit);
    if (result.success) {

        let weatherData = result.data;
        
        Promise.all([renderToday(weatherData),renderFiveDay(weatherData)]).finally(endLoading);
    } else {
       errorDisplay.classList.remove("hide");
       errorDisplay.textContent = `Could not load weather: ${result.message}`;
        console.error("API Error:", result.message);
    }
}

async function renderToday(weatherData){
    locationNameContainer.textContent=weatherData.address.toUpperCase();
    const todayImgUrl= await getImage(weatherData.days[0].icon);
    todayImg.src=todayImgUrl;
    todayTemp.textContent=weatherData.days[0].temp + getUnit();
    addFeats(weatherData);
}
function startLoading(){
    const loader=document.querySelector(".loader");
    const loaderContainer=document.querySelector(".loaderContainer");
    mainContainer.classList.add("hide")
    loader.classList.remove("hide");
    loaderContainer.classList.remove("hide");
}

function endLoading(){
    const loader=document.querySelector(".loader");
    loader.classList.add("hide");
    const loaderContainer=document.querySelector(".loaderContainer");
    loaderContainer.classList.add("hide");
     mainContainer.classList.remove("hide");
}

async function renderFiveDay(weatherData) {
    cardsContainer.replaceChildren();
    for (let i=1;i<=5;i++) {
        
        const day=weatherData.days[i];
        const card=document.createElement("div");
        card.classList.add("card");

        const date = document.createElement("div");
        date.classList.add("date");
        date.textContent=day.datetime;

        const img = document.createElement("img");
        const imgUrl=await getImage(day.icon);
        img.src=imgUrl;

        const temp=document.createElement("div");
        temp.classList.add("temp","bold","unit");
        temp.textContent=day.temp+getUnit();

        const desc=document.createElement("div");
        desc.classList.add("desc");
        desc.textContent=day.conditions;

        card.append(date,img,temp,desc);
        cardsContainer.append(card);
    }
}

async function getImage(icon){
    const module= await import(`./assets/${icon}.svg`);
    return module.default;
}
function getUnit(){
    if(unit=="metric"){
        return " °C"
    }
    return " °F"
}

function addFeats(weatherData){
    additionalInfoContainer.replaceChildren();
    const feelsLike = document.createElement("div");
    feelsLike.classList.add("feats","unit","feelsLike");
    feelsLike.textContent="Feels like "+weatherData.days[0].feelslike+getUnit();

    const humidity = document.createElement("div");
    humidity.classList.add("feats");
    humidity.textContent="Humidity "+weatherData.days[0].humidity+"%";

    const visibility = document.createElement("div");
    visibility.classList.add("feats");
    visibility.textContent="Visibility "+weatherData.days[0].visibility+"km";

    const condition = document.createElement("div");
    condition.classList.add("feats");
    condition.textContent=weatherData.days[0].conditions;

    additionalInfoContainer.append(feelsLike,humidity,visibility,condition);
}

function setUnit(){
    if(unit=="metric"){
        unit="us";
        toggleUnit.textContent="°F"
    }
    else{
        unit="metric";
        toggleUnit.textContent="°C"
    }
    updateUnit();
}
function updateUnit(){
    const units=document.querySelectorAll(".unit");
    for (const element of units) {
        element.textContent=convertUnit(element.textContent)+getUnit();
    }
}

function convertUnit(value){
    let prefix="Feels like ";
    if (value.startsWith(prefix)) {
        value = value.substring(prefix.length).trim();
    }

    const unit = value.toUpperCase().slice(-1);
    const valueString = value.slice(0, -2).trim();
    const tempValue = parseFloat(valueString);
    let convertedTemp;

    if (unit === 'C') {
        convertedTemp = (tempValue * 9/5) + 32;
    } 
    else if (unit === 'F') {
        convertedTemp = (tempValue - 32) * 5/9;
    } 
    else {
        return null;
    }
    
    return parseFloat(convertedTemp.toFixed(2));
}

setUnit();
renderPage("kyoto");