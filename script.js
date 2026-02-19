function openFeatures(){
    var allElem = document.querySelectorAll('.elem')
    var allFullElem = document.querySelectorAll('.fullElem')
    var allFullElemBackBTN = document.querySelectorAll('.fullElem .back')

    allElem.forEach(function (elem){
        elem.addEventListener('click',function (){
            allFullElem[elem.id].style.display = 'block'
        })
    })

    allFullElemBackBTN.forEach(function (back){
        back.addEventListener('click',function (){
            allFullElem[back.id].style.display = 'none'
        })
    })
};

//openFeatures();

let form = document.querySelector('.addTask form')
let taskInput =document.querySelector('.addTask form input')
let taskDetailsInput = document.querySelector('.addTask form textarea')
let taskCheck = document.querySelector('.addTask form #check')


form.addEventListener('submit',function (e){
    e.preventDefault()
    console.log(taskInput.value)
    console.log(taskDetailsInput.value)
})