const puppeteer = require('puppeteer');
const settings = require('./settings.json');
const blueAntEntries = require('./input.json');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 25
  })
  const page = await browser.newPage()

  const navigationPromise = page.waitForNavigation()

  await page.goto('https://blueantasp26.proventis.net/kiperformance//psap')

  await page.setViewport({ width: 1329, height: 723 })

  await navigationPromise

  await page.waitForSelector('.login_area > #login_form > form > .label:nth-child(6) > input')
  await page.click('.login_area > #login_form > form > .label:nth-child(6) > input')

  await page.type('.login_area > #login_form > form > .label:nth-child(6) > input', settings.username)

  await page.waitForSelector('.login_area > #login_form > form > .label:nth-child(7) > input')
  await page.click('.login_area > #login_form > form > .label:nth-child(7) > input')

  await page.type('.login_area > #login_form > form > .label:nth-child(7) > input', settings.password)

  await page.waitForSelector('#login_content > .login_area > #login_form > form > .button')
  await page.click('#login_content > .login_area > #login_form > form > .button')
  
  await navigationPromise

  await navigationPromise
  
  // Time recording
  await page.waitForSelector('.nano-content > li:nth-child(2)')
  await page.click('.nano-content > li:nth-child(2)')

  await page.waitFor(2000)

  const frame = await page.frames().find(f => f.name().indexOf('oldiframe') !== -1)

  let weekDays = await frame.$$('.cm_curr_kw_day:not(.cm_weekend)')

  for (var i = 0; i < weekDays.length; i++) {
    await weekDays[i].click()
    
    // Time Duration
    const durationSelector = 'input[name=dauer]'
    await frame.waitForSelector(durationSelector)
    await frame.click(durationSelector, {clickCount: 3})
    await page.keyboard.press('Backspace')
    await frame.type(durationSelector, '8')

    // Customer
    const customerSelector = 'select[name=customer]'
    await frame.waitForSelector(customerSelector)
    const customerCode = await frame.$eval(`option[title*="${settings.customerName}"]`, el => el.value)
    await frame.select(customerSelector, customerCode)

    // Project
    const projectSelector = 'select[name=projekt]'
    await frame.waitForSelector(projectSelector)
    const projectCode = await frame.$eval(`option[title*="${settings.projectName}"]`, el => el.value)
    await frame.select(projectSelector, projectCode)

    // Activity
    const activitySelector = 'select[name=task]'
    await frame.waitForSelector(activitySelector)
    const sreCode = await frame.$eval(`option[title*="${settings.activityName}"]`, el => el.value)
    await frame.select(activitySelector, sreCode)

    // Location
    const locationSelector = 'select[name=taetigkeit]'
    await frame.waitForSelector(locationSelector)
    const locationCode = await frame.$eval(`option[title*="${settings.locationName}"]`, el => el.value)
    await frame.select(locationSelector, locationCode)

    // Description
    const descriptionSelector = 'textarea[name=bemerkung1000]'
    await frame.waitForSelector(descriptionSelector)
    await frame.click(descriptionSelector)
    await frame.type(descriptionSelector, blueAntEntries[i].text)

    // Save
    const saveSelector = 'button[name=speichern]'
    await frame.waitForSelector(saveSelector)
    await frame.click(saveSelector)

    // Wait and re-evaluate the frame to get all days again
    await page.waitFor(2000)
    weekDays = await frame.$$('.cm_curr_kw_day:not(.cm_weekend)')
  }

  await browser.close()
})()