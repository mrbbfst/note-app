
const LOCAL_STORAGE_NOTE_LIST = "notes";
let notes = JSON.parse( window.localStorage.getItem(LOCAL_STORAGE_NOTE_LIST) ) ;
notes = notes===null ? [] : notes;

const main = document.getElementById("main");
const createWindow = document.getElementById("create-window");
const createButton = document.getElementById("create-button");
const saveButton = document.getElementById("save-button");
const header = document.getElementById("note-header");
const text = document.getElementById("note-text");
const closeButton = document.getElementById("close-button");
closeButton.addEventListener("click", () => {
    if((!header.value=="" || !text.value=="") && !confirm("Введені данні не збережуться"))
        return;
    createWindow.classList.add("hidden");
    createButton.classList.remove("hidden");
    header.value="";
    text.value="";
});

saveButton.addEventListener("click", () => {
    if(!header.value=="" || !text.value=="") {
        createWindow.classList.add("hidden");
        createButton.classList.remove("hidden");
        saveNote();
        header.value="";
        text.value="";
    }
})
createButton.addEventListener("click", () => {
    createWindow.classList.remove("hidden");
    createButton.classList.add("hidden");
    saveWindowInputsChanged();
});

// {
//     "id": 1
//     "header": "this is note header",
//     "text": "this is note text"

// }


function saveNote() {
    const note = {
        "header": header.value,
        "text": text.value,
        "id" : self.crypto.randomUUID()
    }
    notes.push(note);
    main.appendChild(createNoteUI(note));
    window.localStorage.setItem(LOCAL_STORAGE_NOTE_LIST, JSON.stringify(notes));
}



function createNoteUI(note) {
    let noteElement = document.createElement("div");
    noteElement.classList.add("note");

    noteElement.setAttribute("noteId" , note.id ) ;
    noteElement.innerHTML = `
        <h3 class="note-header">${note.header}</h3>
        <p class="note-text">${note.text}</p>
        <span class="delete-note" onclick='deleteNote("${note.id.trim()}")'></span>
        <span class="edit-note" onclick='editNote("${note.id.trim()}")'></span>
        <span class="save-note hidden"></span>
    `;
    noteElement.addEventListener("click", (e) => {

    })

    return noteElement;
}



function deleteNote(noteId) {
    if(!confirm("Видалити нотатку?"))
        return;
    let index = -1;
    for(let i in notes) {
        if(notes[i].id==noteId) {
            index = i;
            break;
        }     
    }
    notes.splice(index, 1);
    window.localStorage.setItem(LOCAL_STORAGE_NOTE_LIST, JSON.stringify(notes));
    main.innerHTML="";
    fillpage();
}

function editNote(noteId) {
    let index = -1;
    for(let i in notes) 
        if(notes[i].id==noteId) {
            index=i;
            break;
        }
    let noteDiv = document.querySelector(`div[noteid='${noteId}']`);
    let header_ = noteDiv.querySelector(".note-header");
    let text_ = noteDiv.querySelector(".note-text");
    let editButton_ = noteDiv.querySelector(".edit-note");
    editButton_.classList.add("hidden");
    let saveButton_ = noteDiv.querySelector(".save-note");
    saveButton_.classList.remove("hidden");
    // saveButton.onclick = null;
    saveButton_.addEventListener("click",(e) => {
        notes[index].header = header_.innerText;
        notes[index].text = text_.innerText;
        window.localStorage.setItem(LOCAL_STORAGE_NOTE_LIST, JSON.stringify(notes));
        editButton_.classList.remove("hidden");
        saveButton_.classList.add("hidden");
        header_.removeAttribute("contenteditable");
        text_.removeAttribute("contenteditable");
    });


    header_.setAttribute("contenteditable", "");
    header_.focus();
    text_.setAttribute("contenteditable", "");
    return;
}

function fillpage() {
    if(notes===null) 
        notes = [];
    for(let note of notes) {
        main.appendChild(createNoteUI(note));
    }
}


header.addEventListener("keyup", (e) => {
    saveWindowInputsChanged();
});

text.addEventListener("keyup", (e) => {
    saveWindowInputsChanged();
})


function saveWindowInputsChanged() {
    if(header.value.length>0 || text.value.length>0) {
        if(saveButton.classList.contains("no-view")) {
            saveButton.classList.remove("hidden");
            saveButton.classList.remove("no-view");
            closeButton.classList.remove("close-button-big");
            closeButton.innerText="";
            
        }
    } else {
        saveButton.classList.add("no-view");
        saveButton.classList.add("hidden");
        closeButton.classList.add("close-button-big");
        closeButton.innerText="Закрити";
        setTimeout(0.25, () => {
            
        })
    }
}

fillpage();
