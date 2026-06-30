// ===================================
// ELEMENTS
// ===================================

const search = document.getElementById("search");
const darkBtn = document.getElementById("darkBtn");
const sort = document.getElementById("sort");
const showFav = document.getElementById("showFav");

const container = document.querySelector(".container");
let cards = [...document.querySelectorAll(".card")];

const visibleBooks = document.getElementById("visibleBooks");
const totalCount = document.getElementById("totalCount");
const noBooks = document.getElementById("noBooks");

// ===================================
// DARK MODE
// ===================================

if(localStorage.getItem("theme")=="light"){
    document.body.classList.add("light");
    darkBtn.innerHTML="☀️ Light Mode";
}

darkBtn.onclick=()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");
        darkBtn.innerHTML="☀️ Light Mode";

    }

    else{

        localStorage.setItem("theme","dark");
        darkBtn.innerHTML="🌙 Dark Mode";

    }

};

// ===================================
// FAVOURITES
// ===================================

cards.forEach((card,index)=>{

    let btn=card.querySelector(".fav-btn");

    if(localStorage.getItem("fav"+index)){

        btn.innerHTML="❤️";

    }

    btn.onclick=()=>{

        if(btn.innerHTML=="🤍"){

            btn.innerHTML="❤️";
            localStorage.setItem("fav"+index,"yes");

        }

        else{

            btn.innerHTML="🤍";
            localStorage.removeItem("fav"+index);

        }

        updateBooks();

    };

});

// ===================================
// SEARCH
// ===================================

search.addEventListener("keyup",updateBooks);

// ===================================
// SHOW FAVOURITES
// ===================================

let favMode=false;

showFav.onclick=()=>{

    favMode=!favMode;

    showFav.innerHTML=favMode?"📚 All Books":"❤️ Favorites";

    updateBooks();

};

// ===================================
// SORT
// ===================================

sort.onchange=()=>{

    cards.sort((a,b)=>{

        let pa=parseFloat(a.querySelector(".price").innerText.replace(/[^\d.]/g,""));

        let pb=parseFloat(b.querySelector(".price").innerText.replace(/[^\d.]/g,""));

        let ta=a.querySelector("h3").innerText;

        let tb=b.querySelector("h3").innerText;

        if(sort.value=="low") return pa-pb;

        if(sort.value=="high") return pb-pa;

        if(sort.value=="title") return ta.localeCompare(tb);

        return 0;

    });

    cards.forEach(card=>container.appendChild(card));

updateBooks();

};

// ===================================
// UPDATE BOOKS
// ===================================

function updateBooks(){

    let value=search.value.toLowerCase();

    let visible=0;

    cards.forEach(card=>{

        let title=card.querySelector("h3").innerText.toLowerCase();

        let fav=card.querySelector(".fav-btn").innerHTML=="❤️";

        let show=title.includes(value);

        if(favMode){

            show=show && fav;

        }

        card.style.display=show?"block":"none";

        if(show) visible++;

    });

    visibleBooks.innerHTML=visible;

    totalCount.innerHTML=cards.length;

    noBooks.style.display=visible==0?"block":"none";

}

// ===================================
// STATISTICS
// ===================================

const prices=[];

document.querySelectorAll(".price").forEach(price=>{

    let value=parseFloat(

        price.textContent.replace(/[^\d.]/g,"")

    );

    if(!isNaN(value)){

        prices.push(value);

    }

});

document.getElementById("totalBooks").innerHTML=prices.length;

if(prices.length>0){

    let sum=prices.reduce((a,b)=>a+b,0);

    let avg=sum/prices.length;

    document.getElementById("avgPrice").innerHTML="₹"+avg.toFixed(2);

    document.getElementById("highestPrice").innerHTML="₹"+Math.max(...prices).toFixed(2);

    document.getElementById("lowestPrice").innerHTML="₹"+Math.min(...prices).toFixed(2);

}

// ===================================
// CHART
// ===================================

const ranges=[0,0,0,0,0];

prices.forEach(price=>{

    if(price<10)

        ranges[0]++;

    else if(price<20)

        ranges[1]++;

    else if(price<30)

        ranges[2]++;

    else if(price<40)

        ranges[3]++;

    else

        ranges[4]++;

});

new Chart(document.getElementById("priceChart"),{

type:"bar",

data:{

labels:["₹0-10","₹10-20","₹20-30","₹30-40","₹40+"],

datasets:[{

label:"Books",

data:ranges,

backgroundColor:"#38bdf8"

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:true

}

}

}

});

// ===================================
// LOADER
// ===================================

window.onload = () => {

    setTimeout(() => {

        let loader = document.getElementById("loader");

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

            }, 800);

        }

    }, 1500);

    updateBooks();

};