let notesListWrapper = document.querySelector(".todo-list");
let notesArchiveListWrapper = document.querySelector(".todo-wrapper-info");

const archiveAll = document.querySelector("#button-archive");
const deleteAll = document.querySelector("#delete-button");
const showArchive = document.querySelector("#show-archive");

const showUp = document.querySelector("#show-archive-image-up");
const showDown = document.querySelector("#show-archive-image-down");

const modalEditor = document.querySelector("#Change_modal");
const modalEditorSubmit = document.querySelector("#Change_date");
const closeModalEditor = document.querySelector("#closeChangeMenu");

const modalCreator = document.getElementById("myModal");
const modalCreatorOpen = document.getElementById("todo-button-create");
const closeModalCreator = document.querySelector("#close");
const modalCreatorSumbit = document.querySelector("#InputData");

let List = [];
let ArchiveList = [];

let localLst = JSON.parse(localStorage.getItem("list"));
localLst != null ? (List = localLst) : (List = []);
localLst = JSON.parse(localStorage.getItem("archive"));
localLst != null ? (ArchiveList = localLst) : (ArchiveList = []);

const Item = (item, index, archive) => {
  const archiveImg = archive
    ? "./images/Unarchive.png"
    : "./images/archiveblack.png";
  const classChange = archive ? "Non-Change" : "";
  let classIcon;
  if (item.category == "Random Thought") {
    classIcon = "header-line-itemRandom";
  } else if (item.category == "Task") {
    classIcon = "header-line-itemTask";
  } else {
    classIcon = "header-line-itemIdea";
  }
  const noteTemplate = ` <div class="todo-item ${classIcon}">
                      
                          <ul class="header-line item-line ">
                              <li class="item-name ">${item?.name}</li>
                              <li >${item.date}</li>
                              <li>${item.category}</li>
                              <li>${item.context}</li>
                              <li>${item.planDate}</li>
                          </ul>
                              
                              <ul class="header-line-buttons">
                              <li><button class="Delete-but ${classChange}" onclick={modalEditorOpen(${index})}><img class="Delete_button change-button" src="./images/pen.png"></button></li>
                              <li><button class="Delete-but" onclick={archiveNote(${index},${archive})}><img class="Delete_button" src=${archiveImg}></button> </li>
                              <li><button class="Delete-but" onclick={deleteNote(${archive},${index})}><img class="Delete_button" src="./images/garbageBlack.png"></img></button></li>
                          </ul>
          
                      
                  </div>`;
  return noteTemplate;
};

const uploadLocal = (name, lst) => {
  lst
    ? localStorage.setItem(name, JSON.stringify(lst))
    : localStorage.setItem(name, JSON.stringify([]));
};

const renderNotes = (td, lst, archive) => {
  if (archive) {
    td.innerHTML = "";
    lst.map((i, ind) => (td.innerHTML += Item(i, ind, true)));
  } else {
    td.innerHTML = "";
    lst.map((i, ind) => (td.innerHTML += Item(i, ind, false)));
  }
};

showArchive.addEventListener("click", () => {
  if (notesArchiveListWrapper.classList[1] == "todo-wrapper-info-unactive") {
    notesArchiveListWrapper.classList.remove("todo-wrapper-info-unactive");
    showDown.style.display = "none";
    showUp.style.display = "block";
  } else {
    notesArchiveListWrapper.classList.add("todo-wrapper-info-unactive");
    showUp.style.display = "none";
    showDown.style.display = "block";
  }
});

archiveAll.addEventListener("click", () => {
  List.forEach((i) => {
    ArchiveList.push(i);
  });
  List = [];
  renderNotes(notesArchiveListWrapper, ArchiveList, true);
  renderNotes(notesListWrapper, List, false);
  uploadLocal("archive", ArchiveList);
  uploadLocal("list", List);
  renderStats(List, ArchiveList);
});

deleteAll.addEventListener("click", () => {
  List = [];
  notesListWrapper.innerHTML = "";
  ArchiveList = [];
  notesArchiveListWrapper.innerHTML = "";
  uploadLocal("list", List);
  uploadLocal("archive", ArchiveList);
  renderStats(List, ArchiveList);
});

const deleteNote = (archiv, index) => {
  if (archiv) {
    ArchiveList.pop(index);
    renderNotes(notesArchiveListWrapper, ArchiveList, archiv);
    uploadLocal("archive", ArchiveList);
  } else {
    List.pop(index);
    renderNotes(notesListWrapper, List, archiv);
    uploadLocal("list", List);
  }
  renderStats(List, ArchiveList);
};

const archiveNote = (index, archive) => {
  if (archive) {
    List.push(ArchiveList[index]);
    ArchiveList.pop(index);
    renderNotes(notesListWrapper, List, false);
    renderNotes(notesArchiveListWrapper, ArchiveList, true);
    uploadLocal("list", List);
    uploadLocal("archive", ArchiveList);
    uploadLocal("list", List);
    renderStats(List, ArchiveList);
  } else {
    ArchiveList.push(List[index]);
    List.pop(index);
    renderNotes(notesListWrapper, List, false);
    renderNotes(notesArchiveListWrapper, ArchiveList, true);
    uploadLocal("list", List);
    uploadLocal("archive", ArchiveList);
    renderStats(List, ArchiveList);
  }
};

closeModalEditor.addEventListener("click", () => {
  modalEditor.style.display = "none";
});
closeModalCreator.addEventListener("click", () => {
  modalCreator.style.display = "none";
});

modalCreatorSumbit.addEventListener("submit", (e) => {
  e.preventDefault();
  let tempDate = new Date();
  const Note = {
    name: e.target.name.value,
    date: tempDate.toLocaleDateString(),
    category: e.target.category.value,
    context: e.target.context.value,
    planDate: e.target.date.value,
  };
  List.push(Note);
  modalCreator.style.display = "none";
  notesListWrapper.innerHTML = "";
  List.forEach(
    (i, index) => (notesListWrapper.innerHTML += Item(i, index, false))
  );
  localStorage.setItem("list", JSON.stringify(List));
  renderStats(List, ArchiveList);
});
const modalEditorFunc = (e, index) => {
  e.preventDefault();
  let newDate = e.target.date.value;
  newDate == ""
    ? (modalEditor.style.display = "none")
    : (List[index].planDate = e.target.date.value);
  renderNotes(notesListWrapper, List, false);
  uploadLocal("list", List);
  modalEditor.style.display = "none";
};
const modalEditorOpen = (index) => {
  modalEditor.style.display = "block";
  modalEditorSubmit.addEventListener("submit", (e) =>
    modalEditorFunc(e, index)
  );
};

modalCreatorOpen.onclick = function () {
  modalCreator.style.display = "block";
};
window.onclick = function (event) {
  if (event.target == modalCreator) {
    modalCreator.style.display = "none";
  }
};
window.onclick = function (event) {
  if (event.target == modalEditor) {
    modalEditor.style.display = "none";
  }
};

const renderStats = (List, ArchiveList) => {
  let randAct = document.querySelector("#Random-active");
  let randArc = document.querySelector("#Random-archive");
  let taskAct = document.querySelector("#Task-active");
  let taskArc = document.querySelector("#Task-archive");
  let ideact = document.querySelector("#Idea-active");
  let ideakArc = document.querySelector("#Idea-archive");
  let tempId = 0;
  let tempTask = 0;
  let tempRand = 0;
  List.map((i) => {
    if (i.category == "Idea") {
      tempId++;
    } else if (i.category == "Task") {
      tempTask++;
    } else if (i.category == "Random Thought") {
      tempRand++;
    }
  });
  ideact.innerHTML = tempId;
  taskAct.innerHTML = tempTask;
  randAct.innerHTML = tempRand;
  tempId = 0;
  tempTask = 0;
  tempRand = 0;
  ArchiveList.map((i) => {
    if (i.category == "Idea") {
      tempId++;
    } else if (i.category == "Task") {
      tempTask++;
    } else if (i.category == "Random Thought") {
      tempRand++;
    }
  });
  ideakArc.innerHTML = tempId;
  taskArc.innerHTML = tempTask;
  randArc.innerHTML = tempRand;
};

List.forEach(
  (i, index) => (notesListWrapper.innerHTML += Item(i, index, false))
);
ArchiveList.forEach(
  (i, index) => (notesArchiveListWrapper.innerHTML += Item(i, index, true))
);

renderStats(List, ArchiveList);
