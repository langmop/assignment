const puppeteer = require("puppeteer");
const request = require("request");
const cheerio = require("cheerio");
const cb = (error, response, html) => {
  if (error) return;
  else {
    requestHandler(html);
  }
};
let cPage;
let browserOpen = puppeteer.launch({ headless: false });
let pageBrowserPromise = browserOpen.then(function (browser) {
  let pageOpen = browser.pages();
  return pageOpen;
});

pageBrowserPromise
  .then(function (browserPages) {
    cPage = browserPages[0];
    let gotoPromise = cPage.goto("https://www.google.com/");
    return gotoPromise;
  })
  .then(function () {
    let anotherPromise = cPage.keyboard.type("wikipedia");
    return anotherPromise;
  })
  .then(function () {
    let enterPressed = cPage.keyboard.press("Enter");
    return enterPressed;
  })
  .then(function () {
    let elementWaitPromise = cPage.waitForSelector("h3.LC20lb", {
      visible: true,
    });
    return elementWaitPromise;
  })
  .then(function () {
    let clickedPromise = cPage.click("h3.LC20lb");
    return clickedPromise;
  })
  .then(function () {
    let elementWaitPromise = cPage.waitForSelector("a", {
      visible: true,
    });
    return elementWaitPromise;
  })
  .then(function () {
    let clickedEnglishPromise = cPage.click("a");
    return clickedEnglishPromise;
  })
  .then(function () {
    let elementWaitPromise = cPage.waitForSelector(
      "a[href$='wiki/Wikipedia:Contents/Portals']",
      {
        visible: true,
      }
    );
    return elementWaitPromise;
  })
  .then(function () {
    let allPortalPromise = cPage.click(
      "a[href$='wiki/Wikipedia:Contents/Portals']"
    );
    return allPortalPromise;
  })
  .then(function () {
    let A_ZPromise = cPage.click(
      "a[href$='/wiki/Wikipedia:Contents/A%E2%80%93Z_index']"
    );
    return A_ZPromise;
  })
  .then(function () {
    let elementWaitPromise = cPage.waitForSelector(
      "a[href$='/wiki/Special:AllPages/G']",
      {
        visible: true,
      }
    );
    return elementWaitPromise;
  })
  .then(function () {
    let GPromise = cPage.click("a[href$='/wiki/Special:AllPages/G']");
    return GPromise;
  })
  .then(function () {
    let elementWaitPromise = cPage.waitForSelector("a[href$='/wiki/G']", {
      visible: true,
    });
    return elementWaitPromise;
  })
  .then(function () {
    let mainGPromise = cPage.click("a[href$='/wiki/G']");
    return mainGPromise;
  })
  .then(function () {
    request("https://en.m.wikipedia.org/wiki/G", cb);
  })
  .catch(function (err) {
    console.log(err);
  });
function requestHandler(html) {
  const $ = cheerio.load(html);
  let containerArr = $(".hatnote ~ p");
  for (let i = 0; i < containerArr.length; i++) {
    let data = $(containerArr[i]).text();
    if (
      data.search(
        "Because of French influence, English language orthography shares this feature."
      ) !== -1
    ) {
      console.log(data);
      break;
    }
    console.log(data);
    // console.log($(containerArr[i]).html());
  }
  containerArr = $(".wikitable ~p");
  for (let i = 0; i < containerArr.length; i++) {
    let data = $(containerArr[i]).text();
    if (
      data.search(
        "In older Czech and Slovak orthographies, ⟨g⟩ was used to represent /j/, while /ɡ/ was written as ⟨ǧ⟩ (⟨g⟩ with caron)."
      ) !== -1
    ) {
      console.log(data);
      break;
    }
    console.log(data);
    // console.log($(containerArr[i]).html());
  }
}
