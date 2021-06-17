const a = document.getElementById('button_first');
let List = [];
let ArchiveList = [];
const Create = document.getElementById('todo-button-create');
let todo_list = document.querySelector('.todo-list');
let archive_list = document.querySelector('.todo-wrapper-info');
const ArchiveAll = document.querySelector('#button-archive');
const deleteAll = document.querySelector('#delete-button');
let SentDate=document.querySelector('#Change_date');
const ShowArchive = document.querySelector('#show-archive');
let ChangeModal=document.querySelector('#Change_modal');
let tem = JSON.parse(localStorage.getItem('list'));
tem != null ? List = tem : List = [];
tem = JSON.parse(localStorage.getItem('archive'));
tem != null ? ArchiveList = tem : ArchiveList = [];
const UploadLocal = (name, lst) => {
    lst != undefined ? (
        localStorage.setItem(name, JSON.stringify(lst))) : localStorage.setItem(name, JSON.stringify([]));
    
}

const RenderItem = (td, lst, archive) => {
    if (archive) {
        td.innerHTML = ''
        lst.map((i, ind) => td.innerHTML += Item(i, ind,true));
    }
    else {
        td.innerHTML = '';
        lst.map((i, ind) => td.innerHTML += Item(i, ind,false));
    }
    

}

ShowArchive.addEventListener('click', function () {
    if (archive_list.classList[1] == 'todo-wrapper-info-unactive') {
        archive_list.classList.remove('todo-wrapper-info-unactive');
    }
    else {
        archive_list.classList.add('todo-wrapper-info-unactive');

    }

});

ArchiveAll.addEventListener('click', function () {
    List.map((i) => { ArchiveList.push(i); });
    List = [];
    RenderItem(archive_list, ArchiveList, true);
    RenderItem(todo_list, List, false);
    UploadLocal('archive',ArchiveList);
    UploadLocal('list', List);
    RenderStats(List,ArchiveList);
   
});

deleteAll.addEventListener('click', function () {
    List = [];
    todo_list.innerHTML = '';
    ArchiveList=[];
    archive_list.innerHTML='';
    UploadLocal('list',List);
    UploadLocal('archive',ArchiveList);
    RenderStats(List,ArchiveList);

});


const Delete = (archiv, index) => {
    if (archiv) {
        ArchiveList.pop(index);
        RenderItem(archive_list, ArchiveList, archiv);
        UploadLocal('archive', ArchiveList);
    }
    else {
        List.pop(index);
        RenderItem(todo_list, List, archiv);
        UploadLocal('list', List);
    }
    RenderStats(List,ArchiveList);


}
const Item = (item,index,archive) => {
    
    let img;
    let classChange='';
    if(archive){
        img='Unarchive.png';
        classChange='Non-Change';
    }
    else{
        img='archiveblack.png';
    }
    let cl;
    if(item.category=='Random Thought'){
        cl='header-line-itemRandom';
    }
    else if(item.category=='Task'){
        cl='header-line-itemTask';
    }
    else{
        cl='header-line-itemIdea';
    }
    let temp = ` <div class="todo-item ${cl}">
                    
                        <ul class="header-line item-line ">
                            <li class="item-name ">${item?.name}</li>
                            <li >${item.date}</li>
                            <li>${item.category}</li>
                            <li>${item.context}</li>
                            <li>${item.planDate}</li>
                        </ul>
                            
                            <ul class="header-line-buttons">
                            <li><button class="Delete-but ${classChange}" onclick={Change(${index})}><img class="Delete_button change-button" src="pen.png"></button></li>
                            <li><button class="Delete-but" onclick={Archive(${index},${archive})}><img class="Delete_button" src=${img}></button> </li>
                            <li><button class="Delete-but" onclick={Delete(${false},${index})}><img class="Delete_button" src="garbageBlack.png"></img></button></li>
                        </ul>
        
                    
                </div>`;
    return temp;
}




const Archive = (index,archive) => {
    if(archive){
        List.push(ArchiveList[index]);
        ArchiveList.pop(index);
        RenderItem(todo_list,List,false);
        RenderItem(archive_list,ArchiveList,true);
        UploadLocal('list', List);
        UploadLocal('archive', ArchiveList);
        UploadLocal('list', List);  
    RenderStats(List,ArchiveList);

    }
    else{
    ArchiveList.push(List[index]);
    List.pop(index);
    RenderItem(todo_list,List,false);
    RenderItem(archive_list,ArchiveList,true);
    UploadLocal('list', List);
    UploadLocal('archive', ArchiveList);
    RenderStats(List,ArchiveList);

}}






let SentForm = document.querySelector('#InputData');
let CloseForm = document.querySelector('#close');
CloseForm.addEventListener('click', function () {
    modal.style.display = "none";
});
SentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let tempDate=new Date;
    let datmas=[]
    datmas.push(e.target.date.value);
    let Note = {
        name: e.target.name.value,
        date: tempDate.toLocaleDateString(),
        category: e.target.category.value,
        context: e.target.context.value,
        planDate:datmas
    }
    List.push(Note);
    modal.style.display = "none";
    todo_list.innerHTML = '';
    
    List.map((i, index) => todo_list.innerHTML += Item(i, index,false));
    localStorage.setItem('list', JSON.stringify(List));
    RenderStats(List,ArchiveList);


});
const SubmitD=(e,index)=>{
e.preventDefault();
let newDate=e.target.date.value;
let temp=List[index].planDate;
newDate==''?ChangeModal.style.display="none":(
temp.push(newDate));
List[index].planDate=temp;
RenderItem(todo_list, List, false);
UploadLocal('list', List);
ChangeModal.style.display="none";
}
const Change=(index)=>{
ChangeModal.style.display="block";
SentDate.addEventListener('submit',(e)=>SubmitD(e,index));
}
const ModalON=()=>{
    modal.style.display = "block";
}
var modal = document.getElementById('myModal');
Create.onclick = function () {
    modal.style.display = "block";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



List.map((i, index) => todo_list.innerHTML += Item(i, index,false));
ArchiveList.map((i, index) => archive_list.innerHTML +=Item(i, index,true));




const RenderStats=(List,ArchiveList)=>{
let randAct=document.querySelector('#Random-active');
let randArc=document.querySelector('#Random-archive');
let taskAct=document.querySelector('#Task-active');
let taskArc=document.querySelector('#Task-archive');
let ideact=document.querySelector('#Idea-active');
let ideakArc=document.querySelector('#Idea-archive');
let tempId=0;
let tempTask=0;
let tempRand=0;
List.map((i)=>{
    if(i.category=='Idea'){
        tempId++;
      
    }
    else if(i.category=='Task'){
        tempTask++;
     
    }
    else if(i.category=='Random Thought'){
        tempRand++;
       
    }
    else{

    }
});
ideact.innerHTML=tempId;
taskAct.innerHTML=tempTask;
randAct.innerHTML=tempRand;
tempId=0;
tempTask=0;
tempRand=0;
ArchiveList.map((i)=>{
    if(i.category=='Idea'){
        tempId++;
     
    }
    else if(i.category=='Task'){
        tempTask++;
    
    }
    else if(i.category=='Random Thought'){
        tempRand++;
      
    }
    else{

    }
});
ideakArc.innerHTML=tempId;
taskArc.innerHTML=tempTask;
randArc.innerHTML=tempRand;
}

RenderStats(List,ArchiveList);



