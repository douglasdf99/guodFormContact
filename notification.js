var input = document.querySelector("#phone");
inteliput = window.intlTelInput(input, {
  // allowDropdown: false,
  // autoHideDialCode: false,
  // autoPlaceholder: "off",
  // dropdownContainer: document.body,
  // excludeCountries: ["us"],
  // formatOnDisplay: false,
  geoIpLookup: async function (callback) {
    const response = await fetch("https://ipinfo.io", {
      headers: {
        Accept: "application/json",
      },
    });
    const resp = await response.json();
    console.log(resp);
    var countryCode = resp && resp.country ? resp.country : "BR";
    callback(countryCode);
  },
  // hiddenInput: "full_number",
  initialCountry: "auto",
  // localizedCountries: { 'de': 'Deutschland' },
  // nationalMode: false,
  // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
  // placeholderNumberType: "MOBILE",
  // preferredCountries: ['cn', 'jp'],
  // separateDialCode: true,
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.18/js/utils.js",
});
input.addEventListener("keyup", function () {
  SaveLeadsValidaPhone();
});


function SaveLeadsValidaPhone() {
    let telefone = document.querySelector("#phone");
  
    var errorMap = [
      "Invalid number",
      "Invalid country code",
      "Too short",
      "Too long",
      "Invalid number",
    ];
  
    if (telefone.value.trim()) {
      if (inteliput.isValidNumber()) {
        let phoneError = document.getElementById("phoneError");
        phoneError.style.display = "none";
        return true;
      } else {
        let phoneError = document.getElementById("phoneError");
        phoneError.style.display = "block";
        var errorCode = inteliput.getValidationError();
        phoneError.innerHTML = "Error: " + errorMap[errorCode];
        return false;
      }
    } else {
      let phoneError = document.getElementById("phoneError");
      phoneError.style.display = "block";
      phoneError.innerHTML = "Error: Phone is required";
      return false;
    }
  }
  
function SaveLeadsValidaEmail(emailAdress) {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) {
    return true;
  } else {
    return false;
  }
}

function SaveLeadsValidaForm() {
    let nome = document.getElementById("name").value;
    let email = document.getElementById("email").value;
  
    let isEmail = SaveLeadsValidaEmail(email);
  
    if (nome == "" || nome.length < 2) {
      //Validacao no nome
      let nameError = document.getElementById("nameError");
      nameError.style.display = "block";
      nameError.innerHTML = "Error: Name is required and must be > 2";
      return false;
    } else {
      let nameError = document.getElementById("nameError");
      nameError.style.display = "none";
    }
    if (!isEmail) {
      //Validacao do email
      let emailError = document.getElementById("emailError");
      emailError.style.display = "block";
      emailError.innerHTML = "Error: Email is invalid";
      return false;
    } else {
      let emailError = document.getElementById("emailError");
      emailError.style.display = "none";
    }
    if (!SaveLeadsValidaPhone()) {
      return false;
    }
    return true;
}

Init();
function Init () {
    var form = document.getElementById('form');
    form.addEventListener("submit", function(event){
      console.log('submit', event);
      event.preventDefault();
      sendData()
    });
    console.log('int', form);
}
function sendData() {
    let valido = SaveLeadsValidaForm();
  
    if (valido) {

      document.getElementById("text-enviarSaveLeadsTermos").innerText =
        "Enviando";
  
      let nome = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let message = document.getElementById("message").value;
      let telefone = inteliput.getNumber();
      var data = {
        name: nome,
        email,
        body:message,
        number: telefone.replace("+", "")
      }

      var jwtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2FybmFtZSI6IkFkbWluaXN0cmFkb3IiLCJwcm9maWxlIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNjYwNDE0NDA2LCJleHAiOjE2OTE5NTA0MDZ9.xmmVATJXlUQVDC92cn7qKFL_QbdO8IRbnEOE7-halIs'
      var myHeaders = new Headers({
        'Authorization': 'Bearer ' + jwtoken,
        "Content-Type": "application/json",
      });

      var myInit = { 
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        mode: 'cors',
        cache: 'default'
      };
      let alert = document.getElementById("alert");
      let alertMessage = document.getElementById("alertMessage");
      fetch('https://apiwp.guodti.com/message_notification', myInit)
      .then(function() {
        alert.style.display = 'block';
        alert.setAttribute('class', 'success');
        alertMessage.innerHTML = "Mensagem enviado com suceso"
      }).catch(function(err) {
        console.log(err);
        alert.style.display = 'block';
        alert.setAttribute('class', 'danger');
        alertMessage.innerHTML = "Algo deu errado. Tente mais tarde"
      }).finally(()=>{
        document.getElementById("text-enviarSaveLeadsTermos").innerText =
        "Enviar";
      });
  
    }
  }