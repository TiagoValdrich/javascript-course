class User {

    constructor(name, gender, birthdate, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birthdate = birthdate;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get gender(){
        return this._gender;
    }

    get birthdate(){
        return this._birthdate;
    }

    get country(){
        return this._country;
    }

    get email(){
        return this._email;
    }

    get password(){
        return this._password;
    }

    get photo(){
        return this._photo;
    }

    get admin(){
        return this._admin;
    }

    get register(){
        return this._register;
    }

    set name(name){
        this._name = name;
    }

    set gender(gender){
        this._gender = gender;
    }

    set birthdate(birthdate){
        this._birthdate = birthdate;
    }

    set country(country){
        this._country = country;
    }

    set email(email){
        this._email = email;
    }

    set password(password){
        this._password = password;
    }

    set photo(photo){
        this._photo = photo;
    }

    set admin(admin){
        this._admin = admin;
    }

    set register(register){
        this._register = register;
    }

    loadFromJSON(json) {

        for (let name in json) {

            switch(name) {

                case '_register':
                    this[name] = new Date(json[name]);
                break;

                default:
                    this[name] = json[name];

            }

        }

    }

    static getUsersStorage() {

        let users = [];

        if (localStorage.getItem("users")) {

            users = JSON.parse(localStorage.getItem("users"));

        }

        return users;

    }

    getNewID() {

        let usersID = parseInt(localStorage.getItem("usersID"));

        if (!usersID > 0)
            usersID = 0;

        localStorage.setItem("usersID", ++usersID);

        return usersID;

    }

    save() {

        let users = User.getUsersStorage();

        if (this._id > 0) {

            users.map( user => {

                if (user._id == this._id) {

                    Object.assign(user, this);

                }

                return user;

            });

        } else {

            this._id = this.getNewID();

            users.push(this);

        }

        localStorage.setItem("users", JSON.stringify(users));
        
    }

    remove() {

        let users = User.getUsersStorage();

        users.forEach((userData, index) => {

            if (this._id == userData._id) {

                users.splice(index);

            }

        });

        localStorage.setItem("users", JSON.stringify(users));

    }

}