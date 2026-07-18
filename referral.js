function executeImpressionApi() {
  var referralCode = 'ucKCdS7f'

  var impressionApiUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=` +
    referralCode +
    '&type=impression'

  var xhr = new XMLHttpRequest()

  xhr.open('GET', impressionApiUrl, true)

  xhr.setRequestHeader('Content-Type', 'application/json')

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Impression successfully tracked!')
    } else {
      console.log('Failed to track impression!')
    }
  }

  xhr.onerror = function () {
    console.error('Error tracking impressions')
  }

  xhr.send()
}

function submitForm(event) {
  event.preventDefault()

  var referralCode = 'ucKCdS7f'

  var name = encodeURIComponent(document.getElementById('name').value)

  var email = encodeURIComponent(document.getElementById('email').value)

  var phone = encodeURIComponent(document.getElementById('phone').value)

  var leadApiUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/api/referral?referralCode=` +
    referralCode +
    '&name=' +
    name +
    '&email=' +
    email +
    '&mobile=' +
    phone +
    '&type=lead'

  var xhr = new XMLHttpRequest()

  xhr.open('GET', leadApiUrl, true)

  xhr.setRequestHeader('Content-Type', 'application/json')

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('Lead successfully tracked!')
    } else {
      console.log('Failed to track lead!')
    }
  }

  xhr.onerror = function () {
    console.error('Error tracking lead')
  }

  xhr.send()
}

window.onload = function () {
  executeImpressionApi()
}
