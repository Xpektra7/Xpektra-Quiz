let questionCount = 0 ;
const card = document.getElementById('front');
const bcard = document.getElementById('back');
let index = 0;
let bindex = 0;
const slides = document.getElementsByName('slide');
const bslides = document.getElementsByName('bslide');
let answers = [];
let userScore = 0;
let attempted = 0;
let unasnwered = 0;
let failed = 0;
let userAnswers = [];
for (let index = 0; index < questionCount; index++) {
    userAnswers.push("");
}
let optionOrder = [0,3,1,2];
function start(){
    index = 1;
    document.querySelector('.banner').style.display = "none";
    initializeSlide();
    return index;
}
function review(){
    bindex = 1;
    correction();
    initializeSlide();
    return bindex;
}

function shuffle(array) {
  let currentIndex = array.length;


  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;


    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}



fetch("./question.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("File 404 Not Found");
        }
        return response.json();
      })
      .then(data => {
        data.forEach(question => {
            shuffle(optionOrder);
            questionCount += 1;
            card.insertAdjacentHTML("beforeend",
                `<div class="slide"  name="slide" id="${question.id}">
                <p class="question">${question.id}. ${question.question}</p>
                <div class="options">
                <label for="${question.id}-option-${optionOrder[0]}" class="option">
                    <input type="radio" name="option-${question.id}" id="${question.id}-option-${optionOrder[0]}" value="${question.options[optionOrder[0]]}">
                    ${question.options[optionOrder[0]]}
                </label>
                <label for="${question.id}-option-${optionOrder[1]}" class="option">
                    <input type="radio" name="option-${question.id}" id="${question.id}-option-${optionOrder[1]}" value="${question.options[optionOrder[1]]}">
                     ${question.options[optionOrder[1]]}
                </label>
                <label for="${question.id}-option-${optionOrder[2]}" class="option">
                    <input type="radio" name="option-${question.id}" id="${question.id}-option-${optionOrder[2]}" value="${question.options[optionOrder[2]]}">
                     ${question.options[optionOrder[2]]}
                </label>
                <label for="${question.id}-option-${optionOrder[3]}" class="option">
                    <input type="radio" name="option-${question.id}" id="${question.id}-option-${optionOrder[3]}" value="${question.options[optionOrder[3]]}">
                     ${question.options[optionOrder[3]]}
                </label>
                </div>
                <div class="controls">
                    <button onclick="prevSlide()">&#10094 Previous
                    </button>
                    <button type="submit" class="submit" onclick="submit()">Submit</button>
                    <button onclick="nextSlide()">Next &#10095</button>
                </div>
                </div>`
            );
            bcard.insertAdjacentHTML("beforeend",
                `<div class="slide"  name="bslide" id="${question.id}">
                <p class="question">${question.id}. ${question.question}</p>
                <div class="options">
                <div class="option">${question.options[optionOrder[0]]}</div>
                <div class="option">${question.options[optionOrder[1]]}</div>
                <div class="option">${question.options[optionOrder[2]]}</div>
                <div class="option">${question.options[optionOrder[3]]}</div>
                </div>
                <div class="controls">
                    <button onclick="bprevSlide()">&#10094 Previous
                    </button>
                    <button type="submit" class="summary" onclick="summary()">Summary</button>
                    <button onclick="bnextSlide()">Next &#10095</button>
                </div>
                </div>`
            );

            answers.push(question.answer);
        
      })})
      .catch(error => console.error(error))

function prevSlide(){
    if(index > 1){
        index -= 1;
    }
    initializeSlide();
    return index;
}
function bprevSlide(){
    if(bindex > 1){
        bindex -= 1;
    }
    initializeSlide();
    return bindex;
}
function nextSlide(){
    if(index < questionCount){
        index += 1;
    }
    initializeSlide();
    return index;
}
function bnextSlide(){
    if(bindex < questionCount){
        bindex += 1;
    }
    initializeSlide();
    return bindex;
}

function initializeSlide(){
    slides.forEach(element => {
        if (element.id == index) {
            element.classList.add('inView');
        } else {
            element.classList.remove('inView');
        }
    document.getElementById("questionCount").innerHTML = `${questionCount } Questions` ;
        
    });
    bslides.forEach(element => {
        if (element.id == bindex) {
            element.classList.add('inView');
        } else {
            element.classList.remove('inView');
        }
    })
    slides[0].querySelector(".controls").firstElementChild.style.visibility = "hidden";
    slides[questionCount-1].querySelector(".controls").querySelector(".submit").style.display = "block";
    slides[questionCount-1].querySelector(".controls").lastElementChild.style.display = "none";
    bslides[1].querySelector(".controls").firstElementChild.style.display = "none";
    bslides[questionCount].querySelector(".controls").lastElementChild.style.display = "none";
}
    
setTimeout(() => {
    initializeSlide(); 
}, 1000);
    
window.addEventListener("click", () => {

    slides.forEach(element => {
        (element.querySelectorAll('input')).forEach(option =>{
            if (option.checked) {
                option.parentElement.classList.add("selected");
                userAnswers[element.id-1] = option.value;
                
            }else {
                option.parentElement.classList.remove("selected");
            }
        })
    })  
    
})
function submit() {
    if (window.confirm("Confirm to submit?")) {
        bcard.style.transform = "perspective(400px) rotateY(0deg)";
        userScore=0;
        unasnwered=0;
        failed=0;
        attempted = 0;
        slides.forEach(element => {
            (element.querySelectorAll('input')).forEach(option =>{
                if (option.checked) {
                    attempted +=1;                
                }
            })
        })  
        for (let index = 0; index < questionCount; index++) {
            if (userAnswers[index] == answers[index] ) {
                userScore += 1;
            }
            else{
                failed += 1;
            }
        }
        userScore = (userScore/questionCount) * 100;
        unasnwered = questionCount - attempted;
        failed = failed - unasnwered;
        document.getElementById('userPercent').innerHTML = `${userScore}%`;
        document.getElementById('attempted').querySelector("h1").innerHTML = attempted;
        document.getElementById('unanswered').querySelector("h1").innerHTML = unasnwered;
        document.getElementById('failed').querySelector("h1").innerHTML = failed;
    
    }    
}
function summary() {
    bindex=0;
    initializeSlide();
    return bindex;

}
function correction() {
    bslides.forEach(bslide => {
        bslide.querySelectorAll('.option').forEach(element => {
            if(element.textContent == answers[Number(bslide.id) - 1]){
                element.classList.add("correct");
                
            }
            if(element.textContent == userAnswers[Number(bslide.id) - 1]){
                element.classList.add("picked");
            }
        })
    })

}
function restart() {
    location.reload();
}
