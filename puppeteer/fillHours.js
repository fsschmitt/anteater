const puppeteer = require('puppeteer');
const Sentry = require('@sentry/electron')

const run = (blueAntEntries, options) => {
  return new Promise(async (res, rej) => {
    try {
      const screenshot = await runPuppeteer(blueAntEntries, options)
      res(screenshot);
    } catch (e) {
      if (!isUserCancellation) {
        console.log(e);
        Sentry.captureException(e);
      }

      isUserCancellation = false;
      rej(e.message);
    }
  })
}

const cancel = async () => {
  if (!runningInstance) {
    return
  }

  isUserCancellation = true;
  await runningInstance.close();
  runningInstance = null;
}

// Used to cancel running stuff
let runningInstance = null;
let isUserCancellation = false;

const runPuppeteer = async (blueAntEntries, { headless, settings }) => {
  await cancel();
  const browser = await puppeteer.launch({
    headless: headless,
    slowMo: 25
  })
  runningInstance = browser;
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(10000);

  const navigationPromise = () => page.waitForNavigation()

  await page.goto('https://blueantasp26.proventis.net/kiperformance//psap')

  await page.setViewport({ width: 1329, height: 723 })

  try {
    await page.waitForSelector('.login_area > #login_form > form > .label:nth-child(6) > input')
    await page.click('.login_area > #login_form > form > .label:nth-child(6) > input')

    await page.type('.login_area > #login_form > form > .label:nth-child(6) > input', settings.username)

    await page.waitForSelector('.login_area > #login_form > form > .label:nth-child(7) > input')
    await page.click('.login_area > #login_form > form > .label:nth-child(7) > input')

    await page.type('.login_area > #login_form > form > .label:nth-child(7) > input', settings.password)

    await page.waitForSelector('#login_content > .login_area > #login_form > form > .button')
    await page.click('#login_content > .login_area > #login_form > form > .button')
    await navigationPromise()
  } catch(e) {
    throw new Error('Error while logging in');
  }

  // Time recording
  await page.waitForSelector('.nano-content > li:nth-child(2)')
  await page.click('.nano-content > li:nth-child(2)')

  await page.waitForSelector('[name*="oldiframe"]');
  const frame = await page.frames().find(f => f.name().includes('oldiframe'));

  await frame.waitForSelector('.cm_curr_kw_day:not(.cm_weekend)');
  let weekDays = await frame.$$('.cm_curr_kw_day:not(.cm_weekend)')

  for (var i = 0; i < weekDays.length; i++) {
    if(!blueAntEntries[i].text) {
      continue;
    }

    await weekDays[i].click()

    // Time Duration
    const durationSelector = 'input[name=dauer]'
    await frame.waitForSelector(durationSelector)
    await frame.click(durationSelector, {clickCount: 3})
    await page.keyboard.press('Backspace')
    await frame.type(durationSelector, '8')

    // Customer
    try {
      const customerSelector = 'select[name=customer]'
      await frame.waitForSelector(customerSelector)
      const customerCode = await frame.$eval(`option[title*="${settings.customerName}"]`, el => el.value)
      await frame.select(customerSelector, customerCode)
    } catch(e) {
      throw new Error('Error while choosing customer. Is it well written?')
    }

    // Project
    try {
      const projectSelector = 'select[name=projekt]'
      await frame.waitForSelector(projectSelector)
      const projectCode = await frame.$eval(`option[title*="${settings.projectName}"]`, el => el.value)
      await frame.select(projectSelector, projectCode)
    } catch(e) {
      throw new Error('Error while choosing project. Is it well written?')
    }

    // Activity
    try {
      const activitySelector = 'select[name=task]'
      await frame.waitForSelector(activitySelector)
      const sreCode = await frame.$eval(`option[title*="${settings.activityName}"]`, el => el.value)
      await frame.select(activitySelector, sreCode)
    } catch(e) {
      throw new Error('Error while choosing activity. Is it well written?')
    }

    // Location
    try {
      const locationSelector = 'select[name=taetigkeit]'
      await frame.waitForSelector(locationSelector)
      const locationCode = await frame.$eval(`option[title*="${settings.locationName}"]`, el => el.value)
      await frame.select(locationSelector, locationCode)
    } catch(e) {
      throw new Error('Error while choosing location. Is it well written?')
    }

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

  // Screenshot
  await frame.waitForSelector('.ba.ba-fixed-headers.table.ba-fixedtable');

  const workHoursTable = await frame.$$('.ba.ba-fixed-headers.table.ba-fixedtable')
    .then(tables => tables[0].asElement());
  const boundingBox = await workHoursTable.boundingBox();
  const screenshot = await workHoursTable.screenshot({
    encoding: 'base64',
  })

  await browser.close()
  runningInstance = null;

  return screenshot;
}

exports.run = run;
exports.cancel = cancel;
