//open cards
function openFeatures(){
    var allElem = document.querySelectorAll('.elem')
    var allFullElem = document.querySelectorAll('.fullElem')
    var allFullElemBackBTN = document.querySelectorAll('.fullElem .back')

    let activePage = localStorage.getItem("activePage")
    if(activePage !== null){
        allFullElem[activePage].style.display = 'block'
    }

    allElem.forEach(function (elem){
        elem.addEventListener('click',function (){
            allFullElem[elem.id].style.display = 'block'
            localStorage.setItem("activePage", elem.id)
        })
    })

    allFullElemBackBTN.forEach(function (back){
        back.addEventListener('click',function (){
            allFullElem[back.id].style.display = 'none'
            localStorage.removeItem("activePage")
        })
    })
}
openFeatures()


//todo list
function todoList(){
    var currentTask = []

    if(localStorage.getItem('currentTask')){
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    } else {
        console.log("Task list is empty")
    }

    function renderTask(){
        var allTask = document.querySelector('.allTask')
        let sum=''

        currentTask.forEach(function (e,idx){
            sum=sum+`<div class="task">
            <h5>${e.task}<span class=${e.imp}>IMP</span></h5>
            <button id =${idx} >Mark as Completed</button>
            </div>`
        })    
        allTask.innerHTML=sum
        localStorage.setItem('currentTask',JSON.stringify(currentTask))
        document.querySelectorAll('.task button').forEach(function(btn){
            btn.addEventListener('click',function (){
                currentTask.splice(btn.id,1)
                renderTask()
                Location.reload()
            })
        })
    }

    renderTask()


    let form = document.querySelector('.addTask form')
    let taskInput =document.querySelector('.addTask form input')
    let taskDetailsInput = document.querySelector('.addTask form textarea')
    let taskCheckBox = document.querySelector('.addTask form .mark-imp #check')

    form.addEventListener('submit',function (e){
        e.preventDefault()
        currentTask.push(
            {
                task:taskInput.value,
                details:taskDetailsInput.value,
                imp:taskCheckBox.checked
            }
        )
        renderTask()
        taskCheckBox.checked = false
        taskInput.value = ''
        taskDetailsInput.value = ''
    })
}
todoList()

//daily planner
function dailyPlanner(){
    var dayPlanner = document.querySelector('.day-planner')
    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData'))||{}
    var hours = Array.from({length:18},(_,idx)=>`${6+idx}:00 - ${7+idx}:00`)

    var wholeDaySum=''
    hours.forEach(function (elem,idx){
        var savedData = dayPlanData[idx] || ''
        wholeDaySum=wholeDaySum+`<div class="day-planner-time">
        <p>${elem}</p>
        <input id=${idx} type="text" placeholder="..."  value=${savedData}>
        </div>`
    })


    dayPlanner.innerHTML = wholeDaySum
    var dayPlannerInputs = document.querySelectorAll('.day-planner input')

    dayPlannerInputs.forEach(function (elem){
        elem.addEventListener('input',function (){
            dayPlanData[elem.id] = elem.value
            localStorage.setItem('dayPlanData',JSON.stringify(dayPlanData))
        })
    })
}
dailyPlanner()

//motivational quotes
function motivationQuotes(){
    let motivationQuote = document.querySelector('.motivation-2 h1')
    let motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote(){
        let response = await fetch("https://api.quotable.io/random")
        let data = await response.json()
        motivationQuote.innerHTML =data.content
        motivationAuthor.innerHTML =data.author

    }
    fetchQuote()
}
motivationQuotes()

//pomodoro

function pomodoroTimer(){
    
    let timerInterval = null;
    let totalSecond = 5
    var isWorkSession = true
    let timer = document.querySelector('.pomo-timer h1')
    let start = document.querySelector('.pomo-timer .start-timer')
    let pause = document.querySelector('.pomo-timer .pause-timer')
    let reset = document.querySelector('.pomo-timer .reset-timer')
    let session = document.querySelector('.session')

    function updateTimer(){
        let min = Math.floor(totalSecond/60)
        let sec = totalSecond%60
        timer.innerHTML = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    }

    function startTimer(){
        clearInterval(timerInterval)

        if(isWorkSession){
            totalSecond = 25*60
            timerInterval = setInterval(() => {
                if(totalSecond>0){
                    totalSecond--
                    updateTimer()
                }
                else{
                    //Have a KitKat wala kuch additional feature dal sakta hai sort of 5 min game or just looping animation
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--seagrenn)'
                    totalSecond = 5*60
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                }
            }, 1000)
        }
        else{
            totalSecond= 5*60
            timerInterval = setInterval(() => {
                if(totalSecond>0){
                    totalSecond--
                    updateTimer()
                }
                else{
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--orange)'
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                }
            }, 1000)
            
        }

    
    }

    function pauseTimer(){
        clearInterval(timerInterval)
    }

    function resetTimer(){
        totalSecond = 25*60
        clearInterval(timerInterval)
        updateTimer()
    }

    start.addEventListener('click',startTimer)
    pause.addEventListener('click',pauseTimer)
    reset.addEventListener('click',resetTimer)

}
pomodoroTimer()