class UserController {

    constructor(formId, tbodyId) {

        this.formEl = document.getElementById(formId);
        this.tbodyEl = document.getElementById(tbodyId);

    }

    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type=submit]");

            btnSubmit.disabled = true;

            let values = this.getValues();

            this.getPhoto().then(
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

    getPhoto() {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => {

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

    getValues() {

        let user = {};

        [...this.formEl.elements].forEach(function(field, index) {

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
    
        return new User(user.name, user.gender, user.birthdate, user.country, user.email, user.password, user.photo, user.admin);

    }

    addLine(dataUser) {

        let tr = document.createElement("tr");
        let content = '';

        content += '<tr>';
        content +=      '<td><img src="' + dataUser.photo + '" alt="User Image" class="img-circle img-sm"/></td>';
        content +=      '<td>' + dataUser.name + '</td>';
        content +=      '<td>' + dataUser.email + '</td>';
        content +=      '<td>' + (dataUser.admin == true ? "Sim" : "Não") + '</td>';
        content +=      '<td>' + dataUser.register.toLocaleDateString() + '</td>';
        content +=      '<td>';
        content +=          '<button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>';
        content +=          '<button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>';
        content +=      '</td>';
        content += '</tr>';
    
        tr.innerHTML = content;
    
        this.tbodyEl.appendChild(tr);
    
    }

}