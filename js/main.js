function createElemWithText(p = 'p' ,textContent,className){
  
  

  
    const newP =  document.createElement(p);
    
    newP.textContent = textContent;
    
    if(className){
    newP.className = className;
    }
    return newP;
  }
   

function createSelectOptions(users){

  if(!users){

    return  undefined;
  }

  let myArray = [];

  users.forEach(user => {

const option = document.createElement('option');

option.value = user.id;
option.textContent = user.name;
myArray.push(option);




  })

return myArray;
}
    
    
function toggleCommentSection(postId){

let section = document.querySelector(`section[data-post-id="${postId}"]`);
if(section){
  section.classList.toggle('hide');
}
else if(section != postId){
  return null;
}

else{
return  undefined;
}
return section;

}

function toggleCommentButton(postId){
if(!postId){
  return;
}


let button = document.querySelector(`button[data-post-id = "${postId}"]`);


if(button != null){
  button.textContent === "Show Comments" ? button.textContent = "Hide Comments" : button.textContent === "Hide Comments" ? button.textContent = "Show Comments": null;

}

return button;
}

function deleteChildElements(parentElement){

  if(!(parentElement instanceof HTMLElement)) {
    return undefined;
  }

let child = parentElement.lastElementChild;
while(child){

  parentElement.removeChild(child);
  child = parentElement.lastElementChild;
}
return parentElement;
}


function addButtonListeners(){

  
  const buttons = document.querySelectorAll('main button');

  buttons.forEach(button => {

const postId = button.dataset.postId;
if(!postId){
  return
}
button.addEventListener('click', (event) => {
  toggleComments(event,postId);


  });

 });
return buttons; 
}

function removeButtonListeners(){

 
  const buttons = document.querySelectorAll('main button');
  buttons.forEach(button => {

  const postId = button.dataset.postId;
  button.removeEventListener('click', toggleComments =>{

  });
  });

return buttons;
}

function createComments(comments){
if(!comments){
  return;
}
let frag = document.createDocumentFragment();



const comment = document.querySelectorAll('article');

comments.forEach(comment => {
const article = document.createElement('article');

let h3 = createElemWithText('h3', `${comment.name}`);
let p1 = createElemWithText('p', `${comment.body}`);
let p2 = createElemWithText('p', `From: ${comment.email}`);

article.append(h3,p1,p2);


frag.append(article);

})



return frag;
}

function populateSelectMenu(users){
if(!users){
  return;
}


let menu = document.querySelector("#selectMenu");
let options = createSelectOptions(users);

for(let i = 0; i < options.length; i++){
  let option = options[i];
  menu.append(option);
}

return menu;
}


async function getUsers(){
const users = fetch("https://jsonplaceholder.typicode.com/");

try{

const res = await fetch("https://jsonplaceholder.typicode.com/users");
if(!res.ok) throw new Error;
return await res.json();
}
catch(err){
  console.log(err);
}

}

async function getUserPosts(userId){

  if(!userId){
    return;
  }

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!res.ok) {
      throw new Error;
    }
   
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}


  async function getUser(userId){


    if(!userId){
      return undefined;
    }
  
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!res.ok) {
        throw new Error;
      }
     
      return await res.json();
    } catch (err) {
      console.log(err);
    }


  }


async function getPostComments(postId){

  if(!postId){
    return;
  }

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    if (!res.ok) {
      throw new Error;
    }
   
    return await res.json();
  } catch (err) {
    console.log(err);
  }


}

async function displayComments(postId){

  if(!postId){

    return;
  }

const section = document.createElement('section');
section.dataset.postId = postId;
section.classList.add('comments', 'hide');


let comments = await getPostComments(postId);

let fragment = createComments(comments);

section.append(fragment);

return section;

}


 async function createPosts(posts){

if(!posts){
  return;
}


const fragment = document.createDocumentFragment();

const post = document.querySelectorAll('article');

for(const post of posts){

const article = document.createElement('article');
const h2 = createElemWithText('h2', post.title)
const p1 = createElemWithText('p', post.body);
const p2 = createElemWithText('p', `Post ID: ${post.id}`);
const author = await getUser(post.userId);
const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
const p4 = createElemWithText('p', author.company.catchPhrase);
const button = createElemWithText('button', 'Show Comments');
button.dataset.postId = post.id;
article.append(h2,p1,p2,p3,p4,button);
const section = await displayComments(post.id);
article.append(section);

fragment.append(article);

}


return fragment;

}

async function displayPosts(posts){

const main = document.querySelector('main');

let element = (posts) ? await createPosts(posts): document.querySelector('main p'); 

main.append(element);

return element;

}


function toggleComments(event, postId){

  if(!event && !postId){
    return;
  }
let array = [];

event.target.listener = true;

array.push(toggleCommentSection(postId));
array.push(toggleCommentButton(postId));

return array;


}

async function refreshPosts(posts){
  if(!posts){
    return;
  }
let array = [];

let removeButtons = removeButtonListeners();
let main = deleteChildElements(document.querySelector('main'));
let fragment =  await displayPosts(posts);
let addButtons = addButtonListeners();
array.push(removeButtons,main,fragment,addButtons);

return array;
}

async function selectMenuChangeEventHandler(event){

  if(!event){
    return;
  }

  

let userId = event?.target?.value || 1;
let posts = await getUserPosts(userId);
let refreshPostsArray = await(refreshPosts(posts));



let array = [];

array.push(userId,posts,refreshPostsArray);

return array;


}

 async function initPage(){

let users = await getUsers();
let select = populateSelectMenu(users);

let array = [users,select];

return array;

}

function initApp(){
initPage();
const select = document.getElementById("selectMenu");

select.addEventListener('change', selectMenuChangeEventHandler, false);



}

addEventListener("DOMContentLoaded", initApp);


