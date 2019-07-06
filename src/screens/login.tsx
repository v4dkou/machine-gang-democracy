import _ from 'lodash'
import { reaction } from 'mobx'
import { disposeOnUnmount, inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Text, View } from 'react-native-animatable'
import { HelperText, TextInput } from 'react-native-paper'
// import { AntIcon, MaterialIcon } from 'react-native-vector-icons'
import { showLongToast } from '../../components/utils/toast-utils'
import { UserStore } from '../stores/user-store'
import { T } from '../style/values'
import { validators } from './validation'
import { NavigationStore } from '../../components/navigation/navigation-store'

const ANIM_TIMINGS = {
  delay_1: 300,
  delay_2: 500,
  delay_3: 700,
  delay_4: 800,
  delay_login_1: 200,
  delay_login_2: 400,
  delay_login_3: 300,
  delay_login_4: 1200,
}

interface LoginProps {
  userStore?: UserStore
  navigationStore?: NavigationStore
}

type AnimTypes = 'zoomIn' | 'bounceInUp' | 'zoomOut' | 'bounceOutDown'

// fixme: Didn't have enough time to properly use react-navigation
type SubRoutes = 'onboarding' | 'login' | 'register'

interface LoginChangeableAnims {
  animationLogo_Form: AnimTypes
  animationButton_Form: AnimTypes
  animationLogo_Login: AnimTypes
  animationButton_Login: AnimTypes
}

type LoginState = {
  password: string
  errorPassword: string
  confirm: string
  errorConfirm: string
  email: string
  errorEmail: string
  secureTextEntry: boolean
  activeForm: SubRoutes
  animationLogo: AnimTypes
  animationTitle: AnimTypes
  animationButton: AnimTypes
} & LoginChangeableAnims

@inject('userStore')
@inject('navigationStore')
@observer
export default class Login extends Component<LoginProps, LoginState> {
  public state = {
    password: '',
    errorPassword: '',
    confirm: '',
    errorConfirm: '',
    email: '',
    errorEmail: '',
    secureTextEntry: true,
    activeForm: 'onboarding',
    animationLogo_Form: 'zoomIn',
    animationButton_Form: 'bounceInUp',
    animationLogo_Login: 'zoomIn',
    animationButton_Login: 'bounceInUp',
    animationLogo: 'zoomIn',
    animationTitle: 'zoomIn',
    animationButton: 'bounceInUp',
  } as LoginState

  @disposeOnUnmount
  public loginErrorDisposer
  public loginSuccessDisposer

  public componentDidMount() {
    this.loginErrorDisposer = reaction(
      () => this.props.userStore.loginError,
      error => {
        if (error) {
          showLongToast('Please, check your username and password')
        }
      },
    )

    this.loginSuccessDisposer = reaction(
      () => this.props.userStore.user,
      user => {
        console.tron.warn(JSON.stringify(user))
        if (user) {
          this.props.navigationStore.navigateTo('Discussion')
        }
      },
    )
  }

  public login = () => {
    if (this.handleVerifyLogin()) {
      this.props.userStore.login(this.state.email, this.state.password)
    }
  }

  public register = () => {
    // tslint:disable-next-line:no-empty TODO: Add registration
    if (this.handleVerifyRegister()) {
    }
  }

  public goTo = (activeForm: SubRoutes) => {
    const onboardingAnims = {
      animationLogo_Form: 'zoomIn',
      animationButton_Form: 'bounceInUp',
      animationLogo_Login: 'zoomOut',
      animationButton_Login: 'bounceOutDown',
    } as LoginChangeableAnims

    const loginAnims = {
      animationLogo_Form: 'zoomOut',
      animationButton_Form: 'bounceOutDown',
      animationLogo_Login: 'zoomIn',
      animationButton_Login: 'bounceInUp',
    } as LoginChangeableAnims

    const anims = activeForm === 'onboarding' ? onboardingAnims : loginAnims

    this.setState(anims)
    setTimeout(() => {
      this.setState({
        activeForm,
        password: '',
        errorPassword: '',
        confirm: '',
        errorConfirm: '',
        email: '',
        errorEmail: '',
        secureTextEntry: true,
      })
    }, 800)
  }

  public handleLogin = () => this.goTo('login')
  public handleRegister = () => this.goTo('register')
  public handleBack = () => this.goTo('onboarding')

  public onEmailInput = email => this.setState({ email, errorEmail: '' })

  public onEmailBlur = () =>
    this.setState(validators.emailValidate(this.state.email))

  public onPasswordInput = password =>
    this.setState({ password, errorPassword: '' })

  public onPasswordBlur = () =>
    this.setState(validators.passwordValidate(this.state.password))

  public onConfirmInput = confirm =>
    this.setState({
      confirm,
      errorConfirm: '',
    })

  public onConfirmBlur = () =>
    this.setState(validators.confirmValidate(this.state.confirm, confirm))

  public handleVerifyLogin = (): boolean => {
    const verificationResult = validators.handleVerifyLogin(
      this.state.email,
      this.state.password,
      this.state.confirm,
    )

    this.setState(verificationResult)
    return _.reduce(verificationResult, (result, v, k) => result || !!v)
  }
  public handleVerifyRegister = (): boolean => {
    const verificationResult = validators.handleVerifyRegister(
      this.state.email,
      this.state.password,
      this.state.confirm,
    )
    this.setState(verificationResult)
    return _.reduce(verificationResult, (result, v, k) => result || !!v)
  }

  public onAccessoryPress = () => {
    if (this.state.secureTextEntry) {
      this.setState({ secureTextEntry: false })
    } else {
      this.setState({ secureTextEntry: true })
    }
  }

  // public renderPasswordAccessory = () => {
  //   const { secureTextEntry } = this.state
  //
  //   const name = secureTextEntry ? 'visibility' : 'visibility-off'
  //
  //   return (
  //     <MaterialIcon
  //       size={24}
  //       name={name}
  //       color={T.color.primary}
  //       onPress={this.onAccessoryPress}
  //       suppressHighlighting={true}
  //     />
  //   )
  // }
  //
  // public renderEmailIcon() {
  //   return (
  //     <MaterialIcon
  //       size={24}
  //       name="email"
  //       color={T.color.primary}
  //       onPress={this.onAccessoryPress}
  //       suppressHighlighting={true}
  //     />
  //   )
  // }

  public renderLogin = (email, password, confirm, secureTextEntry) => {
    switch (this.state.activeForm) {
      case 'onboarding':
        return (
          <SafeAreaView>
            <Text
              animation={this.state.animationLogo_Form}
              delay={ANIM_TIMINGS.delay_1}
              duration={100}
            />
            <View
              style={styles.topContainer}
              animation={this.state.animationLogo_Form}
              delay={ANIM_TIMINGS.delay_1}
              duration={400}
            >
              <TouchableOpacity style={styles.logoContent}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logoImage}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
              <Text
                style={styles.textContent}
                animation={this.state.animationLogo_Form}
                delay={ANIM_TIMINGS.delay_2}
                duration={400}
              >
                {T.string.welcome_subtitle}
              </Text>
            </View>
            <View
              style={styles.loginContainer}
              animation={this.state.animationButton_Form}
              delay={ANIM_TIMINGS.delay_3}
              duration={1000}
            >
              <TouchableOpacity
                style={styles.loginButton}
                onPress={this.handleLogin}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={this.handleRegister}
              >
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )
      case 'login':
        return (
          <SafeAreaView>
            <View
              style={styles.backContainer_login}
              animation={this.state.animationLogo_Login}
              delay={ANIM_TIMINGS.delay_login_4}
              duration={400}
            >
              <TouchableOpacity onPress={this.handleBack}>
                <Text>Назад</Text>
                {/*<AntIcon name="arrowleft" size={30} color="#fff" />*/}
              </TouchableOpacity>
            </View>
            <View style={styles.loginForm_scrollContainer}>
              <View
                style={styles.titleContainer_login}
                animation={this.state.animationLogo_Login}
                delay={ANIM_TIMINGS.delay_login_1}
                duration={400}
              >
                <View
                  style={styles.logoContainer_login}
                  animation={this.state.animationLogo_Login}
                  delay={ANIM_TIMINGS.delay_login_3}
                  duration={400}
                >
                  <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logoImage_login}
                  />
                </View>
              </View>
              <View
                style={styles.loginContainer_login}
                animation={this.state.animationButton_Login}
                delay={ANIM_TIMINGS.delay_login_2}
                duration={1000}
              >
                <View>
                  <TouchableOpacity style={styles.itemContent_login}>
                    <TextInput
                      label="Email Address"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={this.onEmailInput}
                      onBlur={this.onEmailBlur}
                    />
                    <HelperText
                      type={'error'}
                      visible={!!this.state.errorEmail}
                    >
                      {this.state.errorEmail}
                    </HelperText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.itemContent_login}>
                    <TextInput
                      label="Password"
                      value={password}
                      secureTextEntry={secureTextEntry}
                      onChangeText={this.onPasswordInput}
                      onBlur={this.onPasswordBlur}
                    />
                    <HelperText
                      type={'error'}
                      visible={!!this.state.errorPassword}
                    >
                      {this.state.errorPassword}
                    </HelperText>
                  </TouchableOpacity>
                </View>

                <View style={styles.loginButtonContainer_login}>
                  <TouchableOpacity
                    style={styles.loginButton_login}
                    onPress={this.login}
                  >
                    <Text style={styles.loginText_login}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.forgotButton_login}>
                    <Text style={styles.forgotText_login}>
                      {T.string.welcome_forgot_password}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.spacer} />
            </View>
          </SafeAreaView>
        )
      case 'register':
        return (
          <SafeAreaView>
            <View
              style={styles.backContainer_login}
              animation={this.state.animationLogo_Login}
              delay={ANIM_TIMINGS.delay_login_4}
              duration={400}
            >
              <TouchableOpacity onPress={this.handleBack}>
                <Text>Назад</Text>
                {/*<AntIcon name="arrowleft" size={30} color="#fff" />*/}
              </TouchableOpacity>
            </View>
            <View style={styles.loginForm_scrollContainer}>
              <View
                style={styles.titleContainer_login}
                animation={this.state.animationLogo_Login}
                delay={ANIM_TIMINGS.delay_login_1}
                duration={400}
              >
                <View
                  style={styles.logoContainer_login}
                  animation={this.state.animationLogo_Login}
                  delay={ANIM_TIMINGS.delay_login_3}
                  duration={400}
                >
                  <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logoImage_login}
                  />
                </View>
              </View>
              <View
                style={styles.loginContainer_login}
                animation={this.state.animationButton_Login}
                delay={ANIM_TIMINGS.delay_login_2}
                duration={1000}
              >
                <Text style={styles.subTitle_login}>Welcome back!</Text>

                <View>
                  <TouchableOpacity style={styles.itemContent_login}>
                    <TextInput
                      label="Email Address"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={this.onEmailInput}
                      onBlur={this.onEmailBlur}
                    />
                    <HelperText
                      type={'error'}
                      visible={!!this.state.errorEmail}
                    >
                      {this.state.errorEmail}
                    </HelperText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.itemContent_login}>
                    <TextInput
                      label="Password"
                      value={password}
                      secureTextEntry={secureTextEntry}
                      onChangeText={this.onPasswordInput}
                      onBlur={this.onPasswordBlur}
                    />
                    <HelperText
                      type={'error'}
                      visible={!!this.state.errorPassword}
                    >
                      {this.state.errorPassword}
                    </HelperText>
                    <TextInput
                      label="Confirm"
                      value={confirm}
                      secureTextEntry={secureTextEntry}
                      onChangeText={this.onConfirmInput}
                      onBlur={this.onConfirmBlur}
                    />
                    <HelperText
                      type={'error'}
                      visible={!!this.state.errorConfirm}
                    >
                      {this.state.errorConfirm}
                    </HelperText>
                  </TouchableOpacity>
                </View>

                <View style={styles.loginButtonContainer_login}>
                  <TouchableOpacity
                    style={styles.loginButton_login}
                    onPress={this.register}
                  >
                    <Text style={styles.loginText_login}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.spacer} />
            </View>
          </SafeAreaView>
        )
    }
  }

  public render() {
    const { email, password, confirm, secureTextEntry } = this.state

    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          animated={false}
          backgroundColor="#347fd5"
        />
        {this.renderLogin(email, password, confirm, secureTextEntry)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  progress: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContent: {
    backgroundColor: '#fff',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
    justifyContent: 'center',
  },
  titleText: {
    color: '#000',
    fontSize: 42,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
    justifyContent: 'center',
  },
  textContent: {
    color: '#333',
    fontSize: 16,
    marginHorizontal: 40,
    textAlign: 'center',
  },
  loginContainer: {
    height: 150,
    alignItems: 'stretch',
    marginBottom: 50,
  },
  loginButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  loginText: {
    color: T.color.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backContainer_login: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  titleContainer_login: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 30,
    justifyContent: 'center',
  },
  titleText_login: {
    color: '#333',
    fontSize: 42,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center',
  },
  logoContainer_login: {
    width: 140,
    height: 140,
    marginTop: 10,
    borderRadius: 70,
    backgroundColor: '#fff',
  },
  logoImage_login: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  loginForm_scrollContainer: {
    flex: 1,
    alignContent: 'space-around',
  },
  spacer: {
    flex: 1,
  },
  loginContainer_login: {
    alignContent: 'space-around',
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  subTitle_login: {
    color: T.color.primary,
    fontSize: 34,
    textAlign: 'center',
  },
  itemContent_login: {
    marginHorizontal: 40,
  },
  loginButtonContainer_login: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  loginButton_login: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: T.color.primary,
  },
  loginText_login: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton_login: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: T.color.primary,
    borderWidth: 1,
  },
  registerText_login: {
    color: T.color.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotButton_login: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    borderRadius: 5,
  },
  forgotText_login: {
    color: '#727272',
    fontSize: 16,
  },
})
