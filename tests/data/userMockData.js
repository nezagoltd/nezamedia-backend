export default {
  signupData: {
    signupValidData: {
      firstName: 'Test',
      lastName: 'Media',
      email: 'recruit.neza@gmail.com',
      username: 'nezatest',
      password: 'NezaMedia1.',
      age: 25,
      sex: 'male',
      city: 'kigali',
      country: 'rwanda',
    },
    signupValidDataWithUnnecessaryData: {
      firstName: 'Neza',
      lastName: 'Media',
      nickname: 'nezago',
      email: 'neza@gmail.com',
      username: 'nezatesttwo',
      password: 'NezaMedia1.',
      age: 25,
      sex: 'male',
      city: 'kigali',
      country: 'rwanda',
    },
    signupEmptyEmail: {
      firstName: 'Neza',
      lastName: 'Media',
      username: 'nezatest',
      password: 'NezaMedia1.',
      age: 25,
      sex: 'male',
      city: 'kigali',
      country: 'rwanda',
    },
    signupEmptyUsername: {
      firstName: 'Neza',
      lastName: 'Media',
      email: 'nezatest@gmmdh.neza',
      password: 'NezaMedia1.',
      age: 25,
      sex: 'male',
      city: 'kigali',
      country: 'rwanda',
    },
  },
  verifyAccountData: {
    fakeToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  loginData: {
    loginVerifiedAcc: {
      email: 'recruit.neza@gmail.com',
      password: 'NezaMedia1.',
    },
  },
  passportData: {
    googleUser: {
      id: '220232cbgoogle',
      email: 'googleuser@nezago.neza',
      given_name: 'googleuser',
      family_name: 'googleuser',
    },
    fcbkUser: {
      id: '220232cbfcbk',
      last_name: 'fcbkuser',
      first_name: 'fcbkuser',
      provider: 'facebook',
    },

  },
};
