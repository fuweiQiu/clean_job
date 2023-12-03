function getHistory(SheetName){
    if(SheetName){
        url = 'https://script.google.com/macros/s/AKfycbzq3pkHUo1fBCxbJqrmcsUfcxjMAR4_KBd3xim6t8y7rfkGoIecavD-auJI4pRzBsSjSQ/exec?action=GetRecord' + SheetName;
    }else{
        url = 'https://script.google.com/macros/s/AKfycbzq3pkHUo1fBCxbJqrmcsUfcxjMAR4_KBd3xim6t8y7rfkGoIecavD-auJI4pRzBsSjSQ/exec?action=GetRecord';
    }
    return new Promise((res, rej) => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                res(data);
            })
            .catch(error => {
                rej(error);
            });
    })
}

function getHistoryNums(){
    url = 'https://script.google.com/macros/s/AKfycbzq3pkHUo1fBCxbJqrmcsUfcxjMAR4_KBd3xim6t8y7rfkGoIecavD-auJI4pRzBsSjSQ/exec?action=GetSheetsName';
    return new Promise((res, rej) => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                res(data)
            })
            .catch(error => {
                rej(error);
            })
    })
}

async function fillHistory(){
    try{
        const data = await getHistory();
        console.log(data);
    } catch(error){
        // let msg = document.createElement('a');
        // msg.textContent = '獲取資訊時出現錯誤';
        makeTextModal('錯誤', '獲取歷史紀錄時出現錯誤');
    }
}

async function fillStackList(){
    try{
        let renderArea = document.getElementById('History');
        const HistoryNum = await getHistoryNums();
        console.log(HistoryNum);
        for(let i = 0; i < HistoryNum.length; i++){
            let newElement = document.createElement('a');
            newElement.classList.add('dropdown-item');
            newElement.textContent = HistoryNum[i];
            renderArea.appendChild(newElement);
            console.log(HistoryNum[i])
        }
        
    }
    catch(error) {
        makeTextModal('錯誤', '獲取歷史紀錄筆數時發生錯誤')
    }
}

//製作modal
function makeTextModal(title, text){
    let modalContainer = document.createElement('div');
    modalContainer.tabIndex = -1;
    modalContainer.classList.add('modal', 'fade');
    modalContainer.role = 'dialog';
    modalContainer.ariaLabel = 'myModalLabel';
    modalContainer.ariaHidden = 'true';
    const date = new Date();
    modalContainer.id = date.getTime().toString();

    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');
    modalDialog.role = 'document';

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    //header部分
    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    let modalTitle = document.createElement('h5');
    modalTitle.textContent = title;
    let btnClose = document.createElement('button');
    btnClose.setAttribute("data-dismiss", "modal");
    btnClose.type = 'button';
    btnClose.classList.add('btn-close');
    btnClose.ariaLabel = 'Close';
    btnClose.addEventListener('click',() => {
        document.body.removeChild(modalContainer);
    })
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(btnClose);

    //body部分
    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body')
    let modalText = document.createElement('h6');
    modalText.textContent = text;
    modalBody.appendChild(modalText);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    modalContainer.appendChild(modalDialog);
    document.body.appendChild(modalContainer);

    let newModal = new bootstrap.Modal(document.getElementById(modalContainer.id));
    newModal.show();
    return modalContainer.id;
}