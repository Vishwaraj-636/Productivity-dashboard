//open cards
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
openFeatures();


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
        var sum=''

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
