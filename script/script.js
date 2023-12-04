// let loginForm = document.getElementById('LoginForm');
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('LoginForm').addEventListener('submit', function(event){
        event.preventDefault(); //阻止表單默認提交行為
    
        let FormData = new FormData(event.target);
        console.log(FormData);
        // let url = 'https://script.google.com/macros/s/AKfycby6CE4Bi2Q0SkzxfmhDfcq1dvzN_5ybeBli-dPYrApnoHbbkIhMwA4sswfF-fK7HkXgJQ/exec?action=Login&username=';
        // fetch(url + )
    })
})

function getHistory(SheetName){
    let url;
    if(SheetName){
        url = 'https://script.google.com/macros/s/AKfycbzq3pkHUo1fBCxbJqrmcsUfcxjMAR4_KBd3xim6t8y7rfkGoIecavD-auJI4pRzBsSjSQ/exec?action=GetRecord&name=' + SheetName;
    }else{
        url = 'https://script.google.com/macros/s/AKfycbzq3pkHUo1fBCxbJqrmcsUfcxjMAR4_KBd3xim6t8y7rfkGoIecavD-auJI4pRzBsSjSQ/exec?action=GetRecord';
    }
    return new Promise((res, rej) => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                res(data);
            })
            .catch(error => {
                console.log(error);
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

async function fillHistory(SheetName){
    // let table = document.createElement('table');
    // table.classList.add('table');
    let tableArea = document.getElementById('historyTable');
    

    // let headerRow = document.createElement('tr');

    // let th0 = document.createElement('th');
    // th0.textContent = '職位';

    // let th1 = document.createElement('th');
    // th1.textContent = '人員';

    // th0.setAttribute('scope', 'col');
    // th1.setAttribute('scope', 'col');
    
    // headerRow.appendChild(th0);
    // headerRow.appendChild(th1);
    // table.appendChild(headerRow);

    let mainArea = document.getElementById('main')

    try{
        const data = await getHistory(SheetName);
        console.log(data);
        for(let i = 0; i < data.length; i++){
            let tr = document.createElement('tr');
            let td0 = document.createElement('td');
            td0.textContent = Object.keys(data[i])
            let td1 = document.createElement('td');
            td1.textContent = Object.values(data[i]);
            tr.appendChild(td0);
            tr.appendChild(td1);
            tableArea.appendChild(tr);
            // document.body.offsetHeight;
            // tableArea.classList.add('table');
        }
    } catch(error){
        console.log(error);
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
            newElement.href = 'history.html?sheetname=' + HistoryNum[i];
            renderArea.appendChild(newElement);
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
