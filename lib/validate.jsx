Validate = {
  email: email => {
    if (!email) {
      return "Email cannot be blank";
    }

    const emailValidationRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailValidationRegex.test(email)) {
      return "Email is invalid";
    }
  },

  password: password => {
    if (!password) {
      return "Password cannot be blank";
    }

    if (password.length < 6) {
      return "Password is too short";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain lowercase letters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain uppercase letters";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain numbers";
    }
  }
};