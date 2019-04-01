class UserController {

    constructor(formId, formIdUpdate, tbodyId) {

        this.formEl = document.getElementById(formId);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tbodyEl = document.getElementById(tbodyId);

        this.onSubmit();
        this.onEdit();

    }

    onEdit() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", event => {

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tbodyEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);
            
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if (!values.photo) {
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);

                    tr.innerHTML = `
                        <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${result._admin == true ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(result._register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                        </td>
                    `;

                    this.addEventsTR(tr);

                    this.updateCount();

                    this.formUpdateEl.reset();

                    this.formEl.reset();

                    btn.disabled = false;
                    
                    this.showPanelCreate();

                },
                (error) => {
                    
                    console.error(error);

                }
            );

        });

    }

    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type=submit]");

            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl);

            if (!values)
                return false;

            this.getPhoto(this.formEl).then(
                (content) => {

                    values.photo = content;

                    this.addLine(values);

                    this.formEl.reset();

                    btnSubmit.disabled = false;

                },
                (error) => {
                    
                    console.error(error);

                }
            );

        });

    }

    getPhoto(formEl) {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item => {

                if (item.name === 'photo') {
                    return item;
                }

            });

            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result)

            }

            fileReader.onerror = (e) => {

                reject(e);

            }

            if (file) {

                fileReader.readAsDataURL(file);

            } else {

                resolve("dist/img/boxed-bg.jpg");

            }

        });        

    }

    getValues(formEl) {

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(function(field, index) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add("has-error");
                isValid = false;

            }

            if (field.name == "gender") {
                
                if (field.checked) {
                    user[field.name] = field.value;
                }
    
            } else if (field.name == "admin") {

                user[field.name] = field.checked;
            
            } else {
    
                user[field.name] = field.value;
    
            }
    
        });

        if (!isValid) {
            return false;
        }
    
        return new User(user.name, user.gender, user.birthdate, user.country, user.email, user.password, user.photo, user.admin);

    }

    addLine(dataUser) {

        let tr = document.createElement("tr");
        let content = '';

        tr.dataset.user = JSON.stringify(dataUser);

        content += '<tr>';
        content +=      '<td><img src="' + dataUser.photo + '" alt="User Image" class="img-circle img-sm"/></td>';
        content +=      '<td>' + dataUser.name + '</td>';
        content +=      '<td>' + dataUser.email + '</td>';
        content +=      '<td>' + (dataUser.admin == true ? "Sim" : "Não") + '</td>';
        content +=      '<td>' + Utils.dateFormat(dataUser.register) + '</td>';
        content +=      '<td>';
        content +=          '<button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>';
        content +=          '<button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>';
        content +=      '</td>';
        content += '</tr>';
    
        tr.innerHTML = content;
    
        this.tbodyEl.appendChild(tr);

        this.addEventsTR(tr);

        this.updateCount();
    
    }

    addEventsTR(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", event => {

            if (confirm("Deseja realmente excluir?")) {

                tr.remove();
                
                this.updateCount();

            }

        });

        tr.querySelector(".btn-edit").addEventListener("click", event => {

            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {

                    switch (field.type) {

                        case 'file':
                        continue;

                        case 'radio':

                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;

                        break;

                        case 'checkbox':

                            field.checked = json[name];

                        break;

                        default:

                            field.value = json[name];

                    }
                    
                }

            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();

        });

    }

    showPanelCreate() {

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }

    showPanelUpdate() {

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tbodyEl.children].forEach(tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) {
                numberAdmin++;
            }

        });

        document.getElementById("usersNumber").innerHTML = numberUsers;
        document.getElementById("adminsNumber").innerHTML = numberAdmin;

    }

}