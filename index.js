//elements 
const numbers = document.getElementById("numbers");
const formElement = document.getElementById("form");
const inputElement = document.getElementById("input");
const scoreElement = document.getElementById("score");
const answerElement = document.getElementById("answer");

let newNums = getNewNumbers();

//make sure random numbers can make 24
while(!checkIfResultReached(newNums)){
    newNums = getNewNumbers();
}

//show user the random numbers
numbers.innerText = `${newNums[0]} ${newNums[1]} ${newNums[2]} ${newNums[3]}`

//set score
let score = JSON.parse(localStorage.getItem("score"));

if(!score)
    score = 0;

//set answer 
let answer = JSON.parse(localStorage.getItem("answer"));

if(!answer)
    answer = 0;

//change inner text of score and answer
scoreElement.innerText = `Score: ${score}`
answerElement.innerText = `Your Answer: ${answer}`

//handle form submission
formElement.addEventListener("submit", ()=>{

    //get numbers the user entered
    let userNums = extractNumbers(inputElement.value);

    try{
        answer = eval(inputElement.value);
    } 
    catch{
        answer = 0;
    }
    
    //if user enters valid expression using correct numbers that equals 24
    if(checkIfNumbersMatch(userNums, newNums) && answer == 24){
        score++;
        answerElement.style.color = "green";
        scoreElement.style.color = "green";
    }   
    else{
        if(score > 0)
            score--;
        answerElement.style.color = "red";
        scoreElement.style.color = "red";
    }
        
    //update score and answer 
    updateLocalStorage();
})

//function that updates score and answer
function updateLocalStorage(){
    localStorage.setItem("score", JSON.stringify(score))
    localStorage.setItem("answer", JSON.stringify(answer))
}

//function to extract numbers out of user-entered expression
function extractNumbers(expression){

    let numbers = [];

    for(let i = 0; i < expression.length; i++)
        if(expression.charAt(i) >= 1 && expression.charAt(i) <= 9)
            numbers.push(+expression.charAt(i))
    
    return numbers; 
}

//function that checks is two sets of numbers are equal
function checkIfNumbersMatch(userNums, correctNums){

    //loop through each userNum
    for(let i = 0; i < userNums.length; i++){

        //loop through each correctNum 
        for(let j = 0; j < correctNums.length; j++)
            if(userNums[i] == correctNums[j])
                correctNums[j] = 0;
    }
    
    for(let k = 0; k < correctNums.length; k++)
        if(correctNums[k] != 0)
            return false;  

    return true; 
}

//function that returns 4 random numbers
function getNewNumbers(){
    return [Math.ceil(Math.random()*9), Math.ceil(Math.random()*9), Math.ceil(Math.random()*9), Math.ceil(Math.random()*9)];
}


//function that checks if list of numbers can make 24 
function checkIfResultReached(inputList){

    //base case: if inputList only has one element compare it to 24 
    if(inputList.length == 1)
        return Math.abs(inputList[0] - 24) < 0.01;

    //loop through every combination of 2 numbers in inputList
    for(let i = 0; i < inputList.length; i++){
        for(let j = i + 1; j < inputList.length; j++){
            
            //create new list 
            let newList = [];

            //copy inputList into newList but leave out inputList[i] and inputList[j]
            for(let k = 0; k < inputList.length; k++)
                if(k != i && k != j)
                    newList.push(inputList[k]);
            
            //store all possible results of inputList[i] and inputList[j]
            let allPossibleResults = generatePossibleResults(inputList[i], inputList[j]);
            
            //iterate through every possible result 
            for(let a = 0; a < allPossibleResults.length; a++){
                
                //add possible result to to newList
                newList.push(allPossibleResults[a]);

                //recursive case: call function again with newList
                if(checkIfResultReached(newList)){

                    //if newList can reach 24, then return true
                    return true;
                }
                else {
                    
                    //otherwise backtrack by removing the value that does not equal 24 
                    newList.pop();
                }     
            } 
        }
    }

    //if we have looped and recursed through every single possible combination of inputList
    return false; 
}


//function that returns all combinations of 2 values (using '+' '-' '*' '/'). 
function generatePossibleResults(a, b){
    
    allPossibleResults = [];
    
    allPossibleResults.push(a + b);
    allPossibleResults.push(a * b);
    allPossibleResults.push(a - b);
    allPossibleResults.push(b - a);
    
    if(a != 0)
        allPossibleResults.push(b / a);
    if(b != 0)
        allPossibleResults.push(a / b);
    
    return allPossibleResults;
}