export const validators = {
  emailValidate: email => {
    if (email === '') {
      return { errorEmail: 'Адрес не может быть пустым' }
    }

    return { errorEmail: '' }
  },

  passwordValidate: password => {
    if (password.length < 6) {
      return { errorPassword: 'Пароль должен быть от шести символов' }
    }

    if (password === '') {
      return { errorPassword: 'Пароль не может быть пустым' }
    }

    return { errorPassword: '' }
  },

  confirmValidate: (password, confirm) => {
    if (confirm !== password) {
      return { errorConfirm: 'Пароли должны совпадать' }
    }

    return { errorConfirm: '' }
  },

  handleVerifyLogin: (email, password, confirm) => {
    return {
      ...validators.emailValidate(email),
      ...validators.passwordValidate(password),
      ...validators.confirmValidate(password, confirm),
    }
  },

  handleVerifyRegister: (email, password, confirm) => {
    return {
      ...validators.emailValidate(email),
      ...validators.passwordValidate(password),
      ...validators.confirmValidate(password, confirm),
    }
  },
}
