
let notesData = []

const savedNotes = localStorage.getItem("notes")

if (savedNotes) {
    notesData = JSON.parse(savedNotes)
}
const charCount = document.getElementById('char-count')
charCount.textContent = window.innerWidth < 768 ? 20 : 75

const textArea = document.getElementById('sticky-note-input')
const heightNoteOffset = window.innerHeight < 1000 ? 150 : 225
const widthNoteOffset = window.innerWidth < 1000 ? 150 : 225

textArea.maxLength = charCount.textContent

textArea.addEventListener('input', function() {
    const maxLength = textArea.getAttribute('maxlength')
    charCount.textContent = maxLength - textArea.value.length
})

document.addEventListener('click', function(e) {
    if (e.target.id === 'add-note-button') {
        handleAddNote()
    } else if (e.target.id === 'clear-notes-button') {
        handleClearNotes()
    } else if (e.target.dataset.urgent) {
        handleUrgent(e.target.dataset.urgent)
    } else if (e.target.dataset.delete) {
        handleDeleteNote(e.target.dataset.delete)
    }
})

window.addEventListener('resize', function() {
    notesData.forEach(function(note) {

        if (note.left > window.innerWidth - widthNoteOffset) {
            note.left = window.innerWidth - widthNoteOffset
        }

        if (note.top > window.innerHeight - heightNoteOffset) {
            note.top = window.innerHeight - heightNoteOffset
        }

        if (note.top < 150) {
            note.top = 150
        }

        if (note.originalLeft > window.innerWidth - widthNoteOffset) {
            note.left = window.innerWidth - widthNoteOffset
        }

        if (note.originalTop > window.innerHeight - heightNoteOffset) {
            note.top = window.innerHeight - heightNoteOffset
        }

        if (note.originalTop < 150) {
            note.top = 150
        }

    })
    render()
})

function handleAddNote() {
    const newNote = document.getElementById('sticky-note-input')

    if (newNote.value) {
        const top = getRandomInt(175, window.innerHeight - heightNoteOffset)
        const left = getRandomInt(0, window.innerWidth - widthNoteOffset)
        notesData.push({
            content: newNote.value,
            top: top,
            originalTop: top,
            left: left,
            originalLeft: left,
            rotate: getRandomInt(-10, 10),
            pinColor: handlePinColor(getRandomInt(0, 3)),
            noteColor: handleNoteColor(getRandomInt(0, 3)),
            urgent: false,
            uuid: crypto.randomUUID(),
        })
        localStorage.setItem("notes", JSON.stringify(notesData))
        textArea.value = ''
        charCount.textContent = window.innerWidth < 768 ? 20 : 75
        render()
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handlePinColor(randomInt) {
    const pinColors = ['tack-red', 'tack-blue', 'tack-green', 'tack-yellow']
    return pinColors[randomInt]
}

function handleNoteColor(randomInt) {
    const noteColors = ['note-yellow', 'note-blue', 'note-green', 'note-red']
    return noteColors[randomInt]
}

function handleDeleteNote(uuid) {
    notesData = notesData.filter(function(note) {
        return note.uuid !== uuid
    })
    localStorage.setItem("notes", JSON.stringify(notesData))
    render()
}

function handleClearNotes() {
    notesData = notesData.filter(function(note) {
        return note.urgent === true
    })
    localStorage.setItem("notes", JSON.stringify(notesData))
    render()
}

function handleUrgent(uuid) {
    const targetNoteObject = notesData.filter(function(note) {
        return note.uuid === uuid
    })[0]
    targetNoteObject.urgent = !targetNoteObject.urgent
    localStorage.setItem("notes", JSON.stringify(notesData))
    render() 
}

function render() {
    const notesContainer = document.getElementById('sticky-notes-container')
    let notesHtml = ''
    notesData.forEach((note) => {

    let urgetIconClass = ''
    let urgetNoteClass = ''
        if (note.urgent) {
            urgetIconClass = 'urgent'
            urgetNoteClass = 'urgent-note'
        }

        notesHtml += `
            <div class="note ${note.noteColor} ${urgetNoteClass}"
                style="top: ${note.top}px; 
                left: ${note.left}px; 
                transform: rotate(${note.rotate}deg);"
            >
                <div class="tack-head ${note.pinColor}"></div>
                <i class="fa-solid fa-x" data-delete="${note.uuid}"></i>

                <div class="note-content" >${note.content}</div>
                <div class="note-details">
                    <span class="note-exclamation">
                        <i class="fa-solid fa-circle-exclamation ${urgetIconClass}"
                        data-urgent="${note.uuid}"></i>
                    </span>
                </div>
            </div>
        `
    })
    notesContainer.innerHTML = notesHtml
}

render()